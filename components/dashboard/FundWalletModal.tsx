import {
  CopyFilled,
  DollarCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, message, Modal, QRCode, Spin } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FundWalletModalProps {
  open: boolean;
  walletAddress: string;
  onClose: () => void;
}

export default function FundWalletModal({
  open,
  walletAddress,
  onClose,
}: FundWalletModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<number>();
  const [steps, setSteps] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    if (paymentMethod === 1) {
      router.push("/dashboard/convert");
    }
  }, [steps, paymentMethod]);
  return (
    <Modal
      destroyOnClose
      title={"Fund Wallet"}
      footer={null}
      open={open}
      onCancel={() => {
        onClose();
        setSteps(0);
        setPaymentMethod(undefined);
      }}>
      <div>
        <p>Send Bitcoin to your wallet address</p>
      </div>
      <div className='mt-6 mb-12'>
        {steps === 0 && (
          <>
            <div
              onClick={() => {
                setPaymentMethod(0);
                setSteps(1);
              }}
              className='flex justify-center items-center gap-4 w-full mx-auto cursor-pointer border rounded-xl p-2 hover:bg-neutral-100 transition-all ease-in'>
              <div className='min-w-8'>
                <Avatar
                  style={{ backgroundColor: "#1677ff" }}
                  icon={<WalletOutlined />}
                />
              </div>
              <div className='text-neutral-700'>
                <h2 className='font-semibold'>Add via On-chain deposit</h2>
                <p>
                  Deposit Bitcoin to your wallet address from an external wallet
                  or exchange.
                </p>
              </div>
            </div>
            <Spin spinning={paymentMethod === 1}>
              <div
                onClick={() => {
                  setPaymentMethod(1);
                }}
                className='flex justify-center items-center gap-4 w-full mx-auto cursor-pointer border rounded-xl p-2 hover:bg-neutral-100 transition-all ease-in mt-4'>
                <div className='min-w-8'>
                  <Avatar
                    style={{ backgroundColor: "#1677ff" }}
                    icon={<DollarCircleOutlined />}
                  />
                </div>
                <div className='text-neutral-700'>
                  <h2 className='font-semibold'>Add via conversion</h2>
                  <p>Convert funds from another balance to your BTC Wallet</p>
                </div>
              </div>
            </Spin>
          </>
        )}
        {steps === 1 && paymentMethod === 0 && (
          <div>
            <QRCode
              value={walletAddress}
              size={265}
              className='w-full mx-auto'
            />
            <div className='mt-4'>
              <h2 className='font-medium mb-2'>Wallet Address</h2>
              <div className='py-2 px-4 text-center font-semibold rounded-xl bg-neutral-100'>
                {walletAddress}
              </div>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                messageApi.success("Copied to clipboard");
              }}
              size='large'
              className='w-full mt-6'
              icon={<CopyFilled />}>
              Copy
            </Button>
          </div>
        )}
      </div>
      {contextHolder}
    </Modal>
  );
}
