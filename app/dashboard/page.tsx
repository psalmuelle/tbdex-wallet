"use client";

import { Button, Divider, Layout, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";
import { decryptAndRetrieveData, decryptData } from "@/lib/encrypt-info";
import type { Web5 } from "@web5/api";
import CreateBTCModal from "@/components/dashboard/CreateBTCAcct";
import { getAddressFromDwn } from "@/lib/web3/getAddressFromDwn";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import DashboardTab from "@/components/dashboard/DashboardTab";

const { Content } = Layout;

export default function Dashboard() {
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [web5, setWeb5] = useState<Web5>();
  const [wallet, setWallet] = useState<{
    address: string;
    privateKey: string;
  }>();
  const [accountLoading, setAccountLoading] = useState(false);
  const [balance, setBalance] = useState<string>();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [open, setOpen] = useState(false);

  const walletAddress =
    wallet?.address.substring(0, 6) +
    "...." +
    wallet?.address.substring(wallet.address.length - 6);

  useEffect(() => {
    setAccountLoading(true);
    async function connectToWeb5() {
      const { web5: userWeb5 } = await initWeb5({ password: sessionKey });
      setWeb5(userWeb5);
    }
    connectToWeb5();
  }, []);

  useEffect(() => {
    const fetchWalletFromDwn = async () => {
      if (web5) {
        try {
          const response = await getAddressFromDwn({ web5 });
          const data = await response![0].data.json();
          const decryptWalletInfo = decryptData({ data: data.wallet });
          setWallet(JSON.parse(decryptWalletInfo));
        } catch (err) {
          console.log(err);
        }
        setAccountLoading(false);
      }
    };
    fetchWalletFromDwn();
  }, [web5]);

  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Dashboard</h1>

      <div>
        <h2 className='font-medium mb-4'>Decentralized Account</h2>
        {accountLoading && (
          <div>
            <Skeleton.Button
              size='large'
              className='max-w-[200px]'
              active={accountLoading}
              block
            />
          </div>
        )}
        {wallet && (
          <>
            <div className='flex items-center gap-1.5 w-fit'>
              <div className='w-fit'>
                <p className='text-3xl font-bold max-sm:text-xl'>
                  {balanceVisible ? `${"$100.32"}` : "******"}
                </p>
              </div>

              <Button
                type='text'
                className='mt-1'
                onClick={() => setBalanceVisible(!balanceVisible)}
                icon={
                  balanceVisible ? (
                    <EyeInvisibleFilled className='text-4xl' />
                  ) : (
                    <EyeFilled className='text-4xl' />
                  )
                }
              />
            </div>

            <div className='mt-4'>
              <p className='text-sm text-gray-500 mb-2 pl-2'>Wallet Address</p>
              <Typography.Text
                copyable={{ text: wallet.address }}
                className='bg-white rounded-xl px-2 py-1'>
                {walletAddress}
              </Typography.Text>
            </div>
          </>
        )}
        {wallet === undefined && !accountLoading && (
          <Button type='primary' className='mt-2' onClick={() => setOpen(true)}>
            Create BTC Account
          </Button>
        )}
      </div>

      <Divider className='mt-12' />
      <div>
        <DashboardTab />
      </div>
      <CreateBTCModal
        web5={web5!}
        open={open}
        closeModal={() => setOpen(false)}
      />
    </Content>
  );
}
