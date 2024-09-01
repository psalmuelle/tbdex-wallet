import axiosInstance from "@/lib/axios";
import {
  FireFilled,
  FireOutlined,
  FullscreenOutlined,
  RetweetOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { Message } from "@tbdex/http-client";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Modal,
  Rate,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

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
};

const { Paragraph } = Typography;

export default function Order({ order, date }: OrderProps) {
  const [open, setOpen] = useState(false);
  const [pfiName, setPfiName] = useState("");
  const [status, setStatus] = useState("");
  const statusColor: { [key: string]: string } = {
    success: "green",
    pending: "yellow",
    processing: "blue",
    failed: "red",
  };
  const orderData: any = order[1].data;

  const pfiDid =
    order[1].from.substring(0, 12) +
    "...." +
    order[1].from.substring(order[1].from.length - 8);

  console.log(order);

  useEffect(() => {
    axiosInstance
      .get(`/api/pfis?pfiDid=${order[1].from}`)
      .then((res) => {
        setPfiName(res.data.pfi.name);
      })
      .catch((err) => {
        console.log(err);
      });

    if (order[1].validNext.has("order")) {
      setStatus("pending");
    } else {
      setStatus("success");
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
          <Tag>{order[1].metadata.id}</Tag>
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
        onCancel={() => setOpen(false)}
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
              <Tag color='orange' icon={<FireOutlined />}>
                Pending
              </Tag>
            </div>

            <div className='flex justify-between items-center gap-4 my-2'>
              <p>Rating</p>
              <Rate disabled defaultValue={0} />
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
                {orderData.payin.currencyCode}{" "}
                <span className='font-semibold'>in BTC</span>
              </p>
            </div>

            {/*  The CTA */}

            <div className='mt-12 mb-4 flex justify-between gap-4 items-center'>
              {order[1].validNext.has("close") && (
                <Button size='large' danger>
                  Cancel Order
                </Button>
              )}
              {order[1].validNext.has("order") && (
                <Button size='large' type='primary' className='w-48'>
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
