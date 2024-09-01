import {
  FullscreenOutlined,
  RetweetOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { Message } from "@tbdex/http-client";
import { Avatar, Badge, Button, Tag } from "antd";

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
};

export default function Order({ order }: OrderProps) {
  const statusColor: { [key: string]: string } = {
    success: "green",
    pending: "yellow",
    processing: "blue",
    failed: "red",
  };
  const orderData: any = order[1].data;

  const status = "pending";
  return (
    <div className='flex justify-between items-center py-2 px-4 border-y cursor-pointer transition-transform transform hover:scale-[1.005] hover:bg-neutral-50'>
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
  );
}
