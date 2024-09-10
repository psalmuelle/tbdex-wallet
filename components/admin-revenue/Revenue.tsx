import { Button, Typography } from "antd";

interface RevenueProps {
  wallet: {
    address: string;
    privateKey: string;
    xpub: string;
  };
  balance: number;
  balanceInUsd: number;
}

export default function Revenue({
  wallet,
  balance,
  balanceInUsd,
}: RevenueProps) {
  return (
    <section>
      <div>
        <h1 className="w-fit mx-auto font-semibold mt-6">Bitcoin Wallet Account</h1>
        <div className='bg-white p-2 rounded-xl mt-2 w-fit mx-auto font-medium'>
          <Typography.Text copyable={{ text: wallet.address }}>
            {wallet.address}
          </Typography.Text>
        </div>
        <div className='rounded-full w-64 h-64 border bg-white flex justify-center items-center flex-col gap-4 mx-auto mb-6 mt-4'>
          <h1 className='font-bold text-3xl'>{balance} ₿</h1>
          <p className='font-medium text-base'>
            ~ ${parseFloat(balanceInUsd.toFixed(2))}
          </p>
        </div>
        <div className='bg-white rounded-xl p-6 mt-6'>
          <h1 className='font-semibold'>Transaction History</h1>
          This is going to be the transaction details of the application
        </div>
      </div>
    </section>
  );
}
