import axiosInstance from "@/lib/axios";
import {
  CheckCircleFilled,
  FireOutlined,
  FullscreenOutlined,
  RetweetOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Close,
  Order,
  TbdexHttpClient,
  type Message,
} from "@tbdex/http-client";
import type { BearerDid } from "@web5/dids";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Divider,
  Form,
  type FormProps,
  Input,
  message,
  Modal,
  Popconfirm,
  Rate,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import Image from "next/image";

function formatTo12HourTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  hours = hours % 12 || 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = isPM ? "pm" : "am";

  return `${hours}:${formattedMinutes}${period}`;
}

type OrderProps = {
  order: Message[];
  date: string;
  userDid: BearerDid;
  setReload: () => void;
  pfis: any;
  searchParamsId: string;
};

const { Paragraph } = Typography;

type FieldType = {
  password: string;
  agree: boolean;
};
type RateFieldType = {
  rating: number;
  review: string;
};
export default function OrderInfo({
  order,
  date,
  userDid,
  searchParamsId,
  pfis,
  setReload,
}: OrderProps) {
  const [open, setOpen] = useState(false);
  const [pfiName, setPfiName] = useState("");
  const [status, setStatus] = useState("");
  const [orderRating, setOrderRating] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingModalLoading, setRatingModalLoading] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const router = useRouter();
  const statusColor: { [key: string]: string } = {
    success: "green",
    pending: "orange",
    processing: "blue",
    failed: "red",
  };
  const orderData: any = order[1].data;

  const pfiDid =
    order[1].from.substring(0, 12) +
    "...." +
    order[1].from.substring(order[1].from.length - 8);

  const handleOrder: FormProps<FieldType>["onFinish"] = async (e) => {
    if (e.password === sessionKey) {
      setIsConfirmLoading(true);
      const tbdOrder = Order.create({
        metadata: {
          from: order[1].metadata.to,
          to: order[1].metadata.from,
          exchangeId: order[1].exchangeId,
          protocol: "1.0",
        },
      });
      await tbdOrder.sign(userDid);
      await TbdexHttpClient.submitOrder(tbdOrder);

      if (searchParamsId === order[1].exchangeId) {
        router.replace("/dashboard/orders");
      }
      setOpen(false);
      setReload();
    } else {
      messageApi.error("Password is incorrect");
    }
  };

  //Create an order rating

  const handleRating: FormProps<RateFieldType>["onFinish"] = async (e) => {
    setRatingModalLoading(true);
    await axiosInstance
      .post("/api/orders", {
        userDid: userDid.uri,
        pfiDid: order[1].from,
        exchangeId: order[1].exchangeId,
        status: "success",
        rating: e.rating,
        review: e.review,
      })
      .then(() => {
        setRatingModalLoading(false);
        setShowRatingModal(false);
        messageApi.success("Rating submitted successfully");
      })
      .catch(() => {
        setRatingModalLoading(false);
        messageApi.error("An error occured!");
      });
  };

  const handleCloseQuote = async () => {
    const tbdOrder = Close.create({
      metadata: {
        from: order[1].metadata.to,
        to: order[1].metadata.from,
        exchangeId: order[1].exchangeId,
        protocol: "1.0",
      },
      data: {
        reason: "User requested to close the order",
      },
    });

    await tbdOrder.sign(userDid);
    await TbdexHttpClient.submitClose(tbdOrder);

    setOpen(false);
    setReload();
  };

  useEffect(() => {
    // Use SearchparamsId to get open Modal
    if (
      searchParamsId === order[1].exchangeId &&
      order[order.length - 1].kind === "quote"
    ) {
      setOpen(true);
    }

    // Set Status of Order
    if (order[order.length - 1].kind === "quote") {
      setStatus("pending");
    } else if (order[order.length - 1].kind === "close") {
      const lastOrderMsg: any = order[order.length - 1].data;
      if (lastOrderMsg.reason === "SUCCESS") {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } else {
      setStatus("processing");
    }

    // Get name of PFI

    pfis.map((pfi: { did: string; name: string }) => {
      if (pfi.did === order[1].from) {
        setPfiName(pfi.name);
      }
    });

    // Get Order Rating If Any
    if (order[order.length - 1].kind === "close") {
      const lastOrderMsg: any = order[order.length - 1].data;
      if (lastOrderMsg.reason === "SUCCESS") {
        axiosInstance
          .get(`/api/orders?exchangeId=${order[1].exchangeId}`)
          .then((res) => {
            if (res.data.orders) {
              setOrderRating(res.data.orders.rating);
            } else {
              setShowRatingModal(true);
            }
          });
      }
    }
  }, []);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className='flex justify-between items-center py-2 px-4 border-y cursor-pointer transition-transform transform hover:scale-[1.005] hover:bg-neutral-50'>
        {contextHolder}
        <div className='w-fit flex gap-2.5 justify-center items-center'>
          <Badge dot color={statusColor[status]}>
            <Avatar icon={<RetweetOutlined rotate={90} />} />
          </Badge>
          <div>
            <p className='font-semibold'>Exchange</p>
            <p>{formatTo12HourTime(order[1].metadata.createdAt)}</p>
          </div>
        </div>
        <div>
          <Tag>{order[1].metadata.exchangeId}</Tag>
        </div>
        <div className='max-w-[185px] flex justify-center items-center gap-4'>
          <div className='w-fit flex gap-2.5 justify-center items-center'>
            <Avatar
              size={"small"}
              src={
                "https://api.dicebear.com/9.x/thumbs/svg?seed=Molly&backgroundType=gradientLinear&shapeColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49,transparent"
              }
              alt='avatar'
            />
            <div>
              <p className='font-medium'>{orderData.payin.amount}</p>
              <p>{orderData.payin.currencyCode}</p>
            </div>
          </div>
          <div>
            <RightOutlined />
          </div>
          <div className='w-fit flex gap-2.5 justify-center items-center'>
            <Avatar
              size={"small"}
              src={
                "https://api.dicebear.com/9.x/thumbs/svg?seed=Whiskers&backgroundType=gradientLinear&shapeColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49,transparent"
              }
              alt='avatar'
            />
            <div>
              <p className='font-medium'>To</p>
              <p>{orderData.payout.currencyCode}</p>
            </div>
          </div>
        </div>
        <Button size='small'>{status}</Button>
        <FullscreenOutlined />
      </div>

      <Modal
        destroyOnClose
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        footer={null}
        className='max-w-md'
        title={
          <div>
            <h1 className='font-bold'>Order Details</h1>
            <p className='font-semibold text-sm'>
              {date} at {formatTo12HourTime(order[1].metadata.createdAt)}
            </p>
          </div>
        }>
        <div className='my-4'>
          <p>PFI Name</p>
          <div className='flex items-center gap-2'>
            <Avatar
              size={"small"}
              src='https://api.dicebear.com/9.x/shapes/svg?seed=Sassy&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear&shape2=ellipseFilled,line,polygonFilled,rectangleFilled,ellipse,polygon,rectangle'
              alt='avatar'
            />
            <p>{pfiName}</p>
          </div>
        </div>

        <div className='mb-4'>
          <p>PFI Did</p>
          <div className='flex items-center gap-2'>
            <Paragraph
              style={{ marginBottom: 0 }}
              copyable={{ text: order[1].from }}>
              {pfiDid}
            </Paragraph>
          </div>
        </div>
        <div className='flex justify-between items-center gap-4'>
          <div>
            <p>From</p>
            <p className='font-medium'>
              {orderData.payin.amount} {orderData.payin.currencyCode}
            </p>
          </div>

          <Button
            size='small'
            icon={<RetweetOutlined rotate={90} shape='circle' />}
          />

          <div>
            <p>To</p>
            <p className='font-medium'>
              {orderData.payout.amount} {orderData.payout.currencyCode}
            </p>
          </div>
        </div>

        <Divider style={{ margin: "20px 0" }} />

        <div>
          <p className='font-medium'>Transaction Details</p>
          <div className='mt-2'>
            <div className='flex justify-between items-center gap-4'>
              <p>Status</p>
              <Tag color={statusColor[status]} icon={<FireOutlined />}>
                {status}
              </Tag>
            </div>

            <div className='flex justify-between items-center gap-4 my-2'>
              <p>Message ID</p>
              <p className='font-medium'>{order[order.length - 1].id}</p>
            </div>

            <div className='flex justify-between items-center gap-4 mb-2'>
              <p>Exchange ID</p>
              <p className='font-medium'>
                {order[order.length - 1].exchangeId}
              </p>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <p>Timestamp</p>
              <p className='font-medium'>{order[order.length - 1].createdAt}</p>
            </div>

            {status === "success" && (
              <div className='flex justify-between items-center gap-4 mt-2'>
                <p>Rating</p>
                <Rate
                  className='text-base'
                  allowHalf
                  disabled
                  defaultValue={orderRating}
                />
              </div>
            )}

            <div className='mt-4 my-2'>
              <p className='underline cursor-pointer'>Payment</p>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <p>Payin Amount</p>
              <p className='font-medium'>
                {orderData.payin.amount} {orderData.payin.currencyCode}
              </p>
            </div>

            <div className='flex justify-between items-center gap-4 mt-2 mb-12'>
              <p>Transaction Fee</p>
              <p className='font-medium'>
                {Number(orderData.payin.amount) / 100}{" "}
                {orderData.payin.currencyCode} in BTC
              </p>
            </div>

            {/* The CTA */}

            {status === "pending" && (
              <div className='mb-4 flex justify-between gap-4 items-center'>
                {order[1].validNext.has("close") && (
                  <Popconfirm
                    title='Delete the task'
                    description='Are you sure to cancel this order?'
                    onConfirm={handleCloseQuote}
                    okText='Yes'
                    cancelText='No'>
                    <Button size={"middle"} danger className='py-2'>
                      Cancel Order
                    </Button>
                  </Popconfirm>
                )}
                {order[1].validNext.has("order") && (
                  <Button
                    size={"middle"}
                    type='primary'
                    className='w-48 py-2'
                    onClick={() => {
                      setConfirmOrder(true);
                    }}>
                    Pay Now
                  </Button>
                )}
                <Modal
                  className='max-w-sm'
                  styles={{ mask: { backgroundColor: "grey", opacity: 0.95 } }}
                  footer={null}
                  destroyOnClose
                  open={confirmOrder}
                  onCancel={() => setConfirmOrder(false)}
                  title={
                    <p className='pr-12'>
                      You are about to pay {orderData.payin.amount} in{" "}
                      {orderData.payin.currencyCode} to {pfiName}.
                    </p>
                  }>
                  <p className='mt-4'>
                    Transaction fee will be deducted from your Bitcoin wallet.
                    1% of your payin amount will be deducted in BTC.
                    <br /> By clicking on the `Confirm Payment` button, you
                    agree to the deduction.
                  </p>
                  <Form
                    name='confirmPayment'
                    className='mt-4'
                    layout={"vertical"}
                    onFinish={handleOrder}>
                    <Form.Item<FieldType>
                      name={"password"}
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                      label={"Password"}>
                      <Input.Password placeholder='Enter your password' />
                    </Form.Item>

                    <Form.Item<FieldType>
                      name={"agree"}
                      valuePropName='checked'>
                      <Checkbox required className='text-gray-700 underline'>
                        I agree to terms and conditions
                      </Checkbox>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        loading={isConfirmLoading}
                        className='w-full'
                        type='primary'
                        htmlType='submit'>
                        Confirm Payment
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            )}

            {status === "processing" && (
              <div className='mb-4 '>
                <Button type='primary' loading className='py-2 w-full'>
                  Processing
                </Button>
              </div>
            )}

            {status === "success" && (
              <div className='mb-4'>
                <Button
                  type='text'
                  className='py-2 w-full bg-green-500 hover:bg-green-500 text-white'
                  icon={<CheckCircleFilled />}>
                  Success
                </Button>
              </div>
            )}

            {status !== "pending" && (
              <Link
                className='underline text-blue-500'
                href={"/dashboard/messages"}>
                Report a problem
              </Link>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        footer={null}
        width={350}
        title={"Order Successful"}
        open={showRatingModal}
        onCancel={() => setShowRatingModal(false)}>
        <div className='mt-6 w-fit mx-auto'>
          <Image
            src={"/order-successful.png"}
            alt='order successful'
            width={200}
            height={150}
          />
        </div>
        <p className='my-4 text-center'>
          Your order has been successfully completed. Please rate your
          experience with <span className='font-medium'>{pfiName}</span>.
        </p>

        <Form name={order[1].exchangeId} onFinish={handleRating}>
          <Form.Item<RateFieldType>
            label={"Rate"}
            name={"rating"}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}>
            <Rate allowHalf />
          </Form.Item>
          <Form.Item<RateFieldType> name={"review"}>
            <Input.TextArea placeholder='Write a review' />
          </Form.Item>
          <Form.Item>
            <Button
              loading={ratingModalLoading}
              htmlType={"submit"}
              type='primary'
              className='w-full'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
