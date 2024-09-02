import axiosInstance from "@/lib/axios";
import {
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
  Divider,
  Modal,
  Popconfirm,
  Rate,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  searchParamsId: string;
};

const { Paragraph } = Typography;

export default function OrderInfo({
  order,
  date,
  userDid,
  searchParamsId,
}: OrderProps) {
  const [open, setOpen] = useState(false);
  const [pfiName, setPfiName] = useState("");
  const [status, setStatus] = useState("");
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

  console.log(order);

  const handleOrder = async () => {
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

    setOpen(false);
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
  };

  useEffect(() => {
    //use SearchparamsId to get open Modal
    if (searchParamsId === order[1].exchangeId) {
      setOpen(true);
    }

    axiosInstance
      .get(`/api/pfis?pfiDid=${order[1].from}`)
      .then((res) => {
        setPfiName(res.data.pfi.name);
      })
      .catch((err) => {
        console.log(err);
      });

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
  }, []);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className='flex justify-between items-center py-2 px-4 border-y cursor-pointer transition-transform transform hover:scale-[1.005] hover:bg-neutral-50'>
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
          if (searchParamsId === order[1].exchangeId) {
            router.replace("/dashboard/orders");
          }
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
              <p>Rating</p>
              <Rate className='text-base' allowHalf disabled defaultValue={0} />
            </div>

            <div className='flex justify-between items-center gap-4'>
              <p>Timestamp</p>
              <p className='font-medium'>{order[1].createdAt}</p>
            </div>

            <div className='mt-4 mb-2'>
              <p className='underline cursor-pointer'>Payment</p>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <p>Amount To Pay</p>
              <p className='font-medium'>
                {orderData.payin.amount} {orderData.payin.currencyCode}
              </p>
            </div>

            <div className='flex justify-between items-center gap-4 my-2'>
              <p>Transaction Fee</p>
              <p className='font-medium'>
                {Number(orderData.payin.amount) / 100}{" "}
                {orderData.payin.currencyCode} in BTC
              </p>
            </div>

            {/*  The CTA */}

            <div className='mt-12 mb-4 flex justify-between gap-4 items-center'>
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
                  onClick={handleOrder}>
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
