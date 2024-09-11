import axiosInstance from "@/lib/axios";
import {
  BlockOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
  RetweetOutlined,
  SyncOutlined,
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
import { decryptAndRetrieveData, decryptData } from "@/lib/encrypt-info";
import Image from "next/image";
import type { Web5 } from "@web5/api";
import { getAddressFromDwn } from "@/lib/web3/getAddressFromDwn";
import { fetchBitcoinInfo, sendBitcoin } from "@/lib/web3/tnx.bitcoin";
import shortenText from "@/lib/shortenText";

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
  web5: Web5;
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
  web5,
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
  const [tnxFee, setTnxFee] = useState(0.00002);
  const [isOnramp, setIsOnramp] = useState(false);
  const [payoutDetails, setPayoutDetails] = useState<{
    type: string;
    detail: string;
  }>();
  const router = useRouter();
  const adminBtcAddress = process.env.NEXT_PUBLIC_ADMIN_BTC_WALLET;
  const statusColor: { [key: string]: string } = {
    success: "green",
    pending: "orange",
    processing: "blue",
    cancelled: "red",
  };
  const orderData: any = order[1].data;

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

      // Get BTC Address from DWN.
      const response = await getAddressFromDwn({ web5 });

      if (response && response?.length === 0) {
        messageApi.error("You do not have a Bitcoin Wallet");
        setIsConfirmLoading(false);
        return;
      }
      const data = await response![0].data.json();
      const decryptWalletInfo = decryptData({ data: data.wallet });
      const parsedWalletInfo = JSON.parse(decryptWalletInfo);

      // Fetch Bitcoin Balance and Check if the user has enough balance to pay for the transaction fee

      if (!isOnramp) {
        const bitcoinWalletInfo: any = await fetchBitcoinInfo({
          address: parsedWalletInfo.address,
        });

        const balArray = bitcoinWalletInfo.map((tnx: { value: number }) => {
          return tnx.value;
        });
        const balInSatoshi = balArray.reduce(
          (acc: number, current: number) => acc + current,
          0
        );

        const walletBalance = balInSatoshi / 100000000;
        const isEnoughBalance = walletBalance >= tnxFee + 0.000008;

        if (!isEnoughBalance) {
          messageApi.error(
            "Insufficient balance in your wallet to pay for the transaction fee"
          );
          setIsConfirmLoading(false);
          return;
        }
      }

      // Sign the order and submit it.
      await tbdOrder.sign(userDid);
      await TbdexHttpClient.submitOrder(tbdOrder);

      // Send Bitcoin to Admin Wallet to pay for the transaction fee
      if (!isOnramp) {
        if (adminBtcAddress === undefined) {
          return;
        }

        await sendBitcoin({
          amountToSend: tnxFee,
          receiverAddress: adminBtcAddress,
          payerAddress: parsedWalletInfo.address,
          privateKey: parsedWalletInfo.privateKey,
        });
      }

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
    setIsOnramp(
      orderData.payout.currencyCode === "BTC" ||
        orderData.payin.currencyCode === "USDC"
    );

    // Set Status of Order
    if (order[order.length - 1].kind === "quote") {
      setStatus("pending");
    } else if (order[order.length - 1].kind === "close") {
      const lastOrderMsg: any = order[order.length - 1].data;
      if (lastOrderMsg.reason === "SUCCESS") {
        setStatus("success");
      } else {
        setStatus("cancelled");
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

    // Get Conversion Rate
    const getConversionRate = async () => {
      if (
        orderData.payout.currencyCode === "BTC" ||
        orderData.payin.currencyCode === "USDC"
      )
        return;
      if (order[order.length - 1].kind === "close") return;
      if (
        orderData.payin.currencyCode === "BTC" ||
        orderData.payout.currencyCode === "BTC"
      ) {
        if (orderData.payin.currencyCode === "BTC") {
          setTnxFee(Number(orderData.payin.amount) * 0.0085);
        } else {
          setTnxFee(Number(orderData.payout.amount) * 0.0085);
        }
      } else if (
        orderData.payin.currencyCode === "USD" ||
        orderData.payout.currencyCode === "USD"
      ) {
        axiosInstance
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${"usd"}`
          )
          .then((res) => {
            if (orderData.payin.currencyCode === "USD") {
              const rate =
                (orderData.payin.amount /
                  res.data.bitcoin[
                    orderData.payin.currencyCode.toLowerCase()
                  ]) *
                0.0085;
              setTnxFee(rate);
            } else {
              const rate =
                (orderData.payout.amount /
                  res.data.bitcoin[
                    orderData.payout.currencyCode.toLowerCase()
                  ]) *
                0.0085;
              setTnxFee(rate);
            }
          });
      } else {
        axiosInstance
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${orderData.payout.currencyCode
              .toLowerCase()
              .slice(0, 3)}`
          )
          .then((res) => {
            const rate =
              (orderData.payout.amount /
                res.data.bitcoin[
                  orderData.payout.currencyCode.toLowerCase().slice(0, 3)
                ]) *
              0.0085;
            setTnxFee(rate);
          });
      }
    };

    const privateData = (order[0] as any).privateData;
    if (
      privateData &&
      privateData.payout &&
      privateData.payout.paymentDetails
    ) {
      const payout = Object.entries(privateData.payout.paymentDetails)[0];
      setPayoutDetails({ type: payout[0], detail: payout[1] as string });
    }

    getConversionRate();
  }, []);
  return (
    <>
      <div className='flex justify-between items-center p-4 mx-4 mb-4 rounded-xl border cursor-pointer transition-transform transform hover:scale-[1.005]'>
        {contextHolder}
        <div className='w-fit flex gap-2.5 justify-center items-center'>
          <Avatar
            className='bg-[#4096ff]'
            icon={<RetweetOutlined rotate={90} />}
          />
          <div>
            <p className='font-semibold'>
              {orderData.payin.currencyCode} ⇌ {orderData.payout.currencyCode}
            </p>
            <p className='text-xs font-medium'>
              {formatTo12HourTime(order[1].metadata.createdAt)}
            </p>
          </div>
        </div>
        <div className='max-lg:hidden'>
          <Typography.Text
            className='text-neutral-800'
            copyable={{ text: order[1].metadata.exchangeId }}>
            {order[1].metadata.exchangeId}
          </Typography.Text>
        </div>
        <Tag
          icon={
            status === "processing" ? (
              <SyncOutlined spin />
            ) : status === "cancelled" ? (
              <CloseCircleOutlined />
            ) : status === "pending" ? (
              <ClockCircleOutlined />
            ) : (
              <CheckCircleFilled />
            )
          }
          color={
            status == "processing"
              ? "processing"
              : status == "cancelled"
              ? "error"
              : status == "pending"
              ? "default"
              : "success"
          }>
          {status}
        </Tag>
        <Button
          type='link'
          icon={<BlockOutlined />}
          onClick={() => setOpen(true)}>
          View Order
        </Button>
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
              src='https://img.icons8.com/emoji/48/bank-emoji.png'
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
              {shortenText(order[1].from, 12, 8)}
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
              {parseFloat(Number(orderData.payout.amount).toFixed(7))}{" "}
              {orderData.payout.currencyCode}
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

            <Divider
              style={{
                margin: "12px 0 8px 0",
                fontSize: "14px",
                fontWeight: "normal",
              }}>
              Payin
            </Divider>

            <div className='flex justify-between items-center gap-4'>
              <p>Amount</p>
              <p className='font-medium'>
                {orderData.payin.amount} {orderData.payin.currencyCode}
              </p>
            </div>

            <Divider
              style={{
                margin: "12px 0 8px 0",
                fontSize: "14px",
                fontWeight: "normal",
              }}>
              Payout
            </Divider>

            <div className='flex justify-between items-center gap-4'>
              <p>Amount</p>
              <p className='font-medium'>
                {orderData.payout.amount} {orderData.payout.currencyCode}
              </p>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <p>
                {payoutDetails?.type === "accountNumber"
                  ? "Account Number"
                  : "Address"}
              </p>
              <p className='font-medium'>{payoutDetails?.detail || "NA"}</p>
            </div>

            <div className='flex justify-between items-center gap-4 mt-2 mb-6'>
              {status === "pending" && !isOnramp && (
                <>
                  <p>Service Charge</p>
                  <p className='font-medium mb-6'>
                    {parseFloat(tnxFee.toFixed(7))} BTC
                  </p>
                </>
              )}
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
                  {!isOnramp && (
                    <p className='text-xs'>
                      A 0.85% service charge will be deducted from your bitcoin
                      wallet balance in BTC. Please, ensure you have enough
                      balance in your wallet.
                    </p>
                  )}
                  <p className='text-xs mt-1'>
                    NB: Additional fees may apply based on your payment and
                    withdrawal methods.
                  </p>
                  {!isOnramp && (
                    <p className='text-xs font-bold mt-1.5'>
                      By clicking on the **Confirm Payment** button, you agree
                      to the deduction of {parseFloat(tnxFee.toFixed(7))} BTC
                    </p>
                  )}
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
