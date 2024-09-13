import {
  CopyFilled,
  DollarCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Divider, message, Modal, QRCode } from "antd";
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
            <Button
              size='large'
              type='primary'
              icon={<WalletOutlined />}
              iconPosition={"end"}
              onClick={() => {
                setPaymentMethod(0);
                setSteps(1);
              }}
              className='w-full'>
              Receive from Wallet/Exchange
            </Button>
            <Divider className='text-sm'>Or</Divider>
            <Button
              icon={<DollarCircleOutlined />}
              iconPosition={"end"}
              size='large'
              loading={paymentMethod === 1}
              onClick={() => {
                setPaymentMethod(1);
              }}
              type='primary'
              className='w-full'>
              Fund wallet with USD
            </Button>
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
