import {
  BlockOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Tag, Typography } from "antd";

type TransactionInfoTypes = {
  tnxId: string;
  status: string;
  amount: number;
  type: "In" | "Out";
};

export default function TransactionInfo({
  tnxId,
  status,
  amount,
  type,
}: TransactionInfoTypes) {
  const shortTnxId =
    tnxId.substring(0, 7) + "...." + tnxId.substring(tnxId.length - 6);

  return (
    <div className='p-4 mx-4 border rounded-xl flex justify-between gap-4 items-center max-sm:flex-col cursor-pointer'>
      <div className='flex items-center gap-1'>
        <Tag className='rounded-xl font-semibold' color='green'>
          {type}
        </Tag>
        <p className='font-medium'>{`${amount}₿`}</p>
      </div>
      <Typography.Text copyable={{ text: tnxId }}>{shortTnxId}</Typography.Text>
      <Tag
        icon={
          status === "processing" ? (
            <SyncOutlined spin />
          ) : (
            <CheckCircleOutlined />
          )
        }
        color={status}
        className='capitalize max-lg:hidden'>
        {status}
      </Tag>
      <Button
        icon={<BlockOutlined />}
        type='link'
        target='_blank'
        href={`https://blockstream.info/testnet/tx/${tnxId}`}>
        View Transaction
      </Button>
    </div>
  );
}
