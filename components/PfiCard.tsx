import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Divider, Rate } from "antd";

export type PfiCardProps = {
  name: string;
  did: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  successRate: number;
  ratings: number;
  isActive: boolean;
};

export default function PfiCard({
  name,
  did,
  totalOrders,
  successRate,
  successfulOrders,
  failedOrders,
  isActive,
  ratings,
}: PfiCardProps) {
  const actions: React.ReactNode[] = [
    isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />,
    <CloseOutlined key='delete' />,
  ];

  return (
    <Card actions={actions} className='min-w-[300px] max-w-xs'>
      <Card.Meta
        avatar={
          <Avatar src='https://api.dicebear.com/9.x/glass/svg?seed=Miss%20kitty' />
        }
        title={name}
        description={
          <>
            <p>{did}</p>
            <Divider />
            <div className='text-gray-700 font-medium'>
              <p>
                Total Orders:{" "}
                <span className='font-semibold'>{totalOrders}</span>
              </p>
              <p>
                Succesful orders:{" "}
                <span className='text-green-500'>{successfulOrders}</span>
              </p>
              <p>
                Failed orders:{" "}
                <span className='text-red-500'>{failedOrders}</span>
              </p>
              <p>Success Rate: {successRate}%</p>
              <p>
                <span className='text-sm font-medium'>Ratings: </span>{" "}
                <Rate
                  disabled
                  defaultValue={ratings}
                  allowHalf
                  className='text-base'
                />
              </p>
            </div>
          </>
        }
      />
    </Card>
  );
}
