import { Button, Empty, Spin, Typography } from "antd";
import DashboardTab from "../dashboard/DashboardTab";
import { useState } from "react";
import CreateBTCModal from "../dashboard/CreateBTCAcct";
import type { Web5 } from "@web5/api";

interface RevenueProps {
  wallet: {
    address: string;
    privateKey: string;
    xpub: string;
  };
  balance: number;
  balanceInUsd: number;
  balanceLoading: boolean;
  web5: Web5;
  setReload: () => void;
}

export default function Revenue({
  wallet,
  balance,
  balanceInUsd,
  balanceLoading,
  web5,
  setReload,
}: RevenueProps) {
  const [openCreateWalletModal, setOpenCreateWalletModal] = useState(false);
  return (
    <section>
      {balanceLoading && <Spin size='large' className='block mx-auto mt-20' />}
      {wallet && !balanceLoading && (
        <div>
          <h1 className='w-fit mx-auto font-semibold mt-6'>
            Bitcoin Wallet Account
          </h1>
          <div className='bg-white p-2 rounded-xl mt-2 w-fit mx-auto font-medium'>
            <Typography.Text copyable={{ text: wallet.address }}>
              {wallet.address}
            </Typography.Text>
          </div>
          <div className='rounded-full w-64 h-64 border bg-white flex justify-center items-center flex-col gap-4 mx-auto mb-6 my-4'>
            <h1 className='font-bold text-3xl'>{balance} ₿</h1>
            <p className='font-medium text-base'>
              ~ ${balanceInUsd && parseFloat(balanceInUsd.toFixed(2))}
            </p>
          </div>
          <DashboardTab wallet={wallet} />
        </div>
      )}
      {!wallet && !balanceLoading && (
        <div className=''>
          <Empty
            className='mt-12'
            description={"You do not have a BTC wallet yet"}>
            <Button
              type='primary'
              className='mt-2'
              size='large'
              onClick={() => setOpenCreateWalletModal(true)}>
              Create BTC Account
            </Button>
          </Empty>
        </div>
      )}
      <CreateBTCModal
        web5={web5}
        open={openCreateWalletModal}
        closeModal={() => {
          setOpenCreateWalletModal(false);
          setReload();
        }}
      />
    </section>
  );
}
