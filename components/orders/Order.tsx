import {
  FullscreenOutlined,
  RetweetOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Tag } from "antd";

type OrderProps = {
  status: string;
  date: string;
  exhangeId: string;
  payinCurrency: string;
  payinAmount: string;
  payoutCurrency: string;
  payoutAmount: string;
};

export default function Order({
  status,
  date,
  exhangeId,
  payinCurrency,
  payinAmount,
  payoutCurrency,
  payoutAmount,
}: OrderProps) {
  const statusColor: { [key: string]: string } = {
    success: "green",
    pending: "yellow",
    processing: "blue",
    failed: "red",
  };
  return (
    <div className='flex justify-between items-center py-2 px-4 border-y cursor-pointer transition-transform transform hover:scale-[1.009] hover:bg-neutral-50'>
      <div className='w-fit flex gap-2.5 justify-center items-center'>
        <Badge dot color={statusColor[status]}>
          <Avatar icon={<RetweetOutlined rotate={90} />} />
        </Badge>
        <div>
          <p className='font-semibold'>Exchange</p>
          <p>{date}</p>
        </div>
      </div>
      <div>
        <Tag>{exhangeId}</Tag>
      </div>
      <div className='flex justify-center items-center gap-4'>
        <div className='w-fit flex gap-2.5 justify-center items-center'>
          <Avatar
            src={"https://api.dicebear.com/9.x/shapes/svg?seed=Dusty"}
            alt='avatar'
          />
          <div>
            <p className='font-medium'>{payinAmount}</p>
            <p>{payinCurrency}</p>
          </div>
        </div>
        <div>
          <RightOutlined />
        </div>
        <div className='w-fit flex gap-2.5 justify-center items-center'>
          <Avatar
            src={"https://api.dicebear.com/9.x/shapes/svg?seed=Maggie"}
            alt='avatar'
          />
          <div>
            <p className='font-medium'>{payoutAmount}</p>
            <p>{payoutCurrency}</p>
          </div>
        </div>
      </div>
      <Button size='small'>{status}</Button>
      <FullscreenOutlined />
    </div>
  );
}
