"use client";

import { Button, Layout, Skeleton } from "antd";
import { CreateBitcoinWallet, CreateMnemonic } from "@/lib/web3/wallet.bitcoin";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";
import { decryptAndRetrieveData, decryptData, encryptData } from "@/lib/encrypt-info";
import type { Web5 } from "@web5/api";
import CreateBTCModal from "@/components/dashboard/CreateBTCAcct";
import { getAddressFromDwn } from "@/lib/web3/getAddressFromDwn";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import DashboardTab from "@/components/dashboard/DashboardTab";

const { Content } = Layout;

export default function Dashboard() {
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [web5, setWeb5] = useState<Web5>();
  const [accountLoading, setAccountLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function connectToWeb5() {
      const { web5: userWeb5 } = await initWeb5({ password: sessionKey });
      setWeb5(userWeb5);
    }
   // connectToWeb5();
  }, []);

  useEffect(() => {
    const fetchWalletFromDwn = async () => {
      if (web5) {
        try {
          const response = await getAddressFromDwn({ web5 });
        } catch (err) {
          console.log(err);
        }
      }
    };
    // fetchWalletFromDwn();
  }, []);
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
        {balance.length > 0 && (
          <div className='flex items-center gap-1.5 w-fit'>
            <div className='w-fit'>
              <p className='text-3xl font-bold'>
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
        )}
        {
          <Button type='primary' className='mt-2' onClick={() => setOpen(true)}>
            Create BTC Account
          </Button>
        }
      </div>

      <div>
        <DashboardTab />
      </div>
      <CreateBTCModal open={open} closeModal={() => setOpen(false)} />
    </Content>
  );
}
