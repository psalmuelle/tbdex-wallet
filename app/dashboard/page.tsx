"use client";

import { Button, Layout, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import initWeb5 from "@/web5/auth/access";
import { decryptAndRetrieveData, decryptData } from "@/lib/encrypt-info";
import type { Web5 } from "@web5/api";
import CreateBTCModal from "@/components/dashboard/CreateBTCAcct";
import { getAddressFromDwn } from "@/lib/web3/getAddressFromDwn";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import DashboardTab from "@/components/dashboard/DashboardTab";
import QuickAction from "@/components/dashboard/QuickActions";
import { useRouter } from "next/navigation";
import { fetchBitcoinInfo } from "@/lib/web3/tnx.bitcoin";
import Image from "next/image";
import SendBtcModal from "@/components/dashboard/SendBtcModal";
import axios from "axios";

const { Content } = Layout;

export default function Dashboard() {
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [web5, setWeb5] = useState<Web5>();
  const [wallet, setWallet] = useState<{
    address: string;
    privateKey: string;
    xpub: string;
  }>();
  const router = useRouter();
  const [accountLoading, setAccountLoading] = useState(false);
  const [balance, setBalance] = useState<number>();
  const [balanceInUsd, setBalanceInUsd] = useState<number>();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  const walletAddress =
    wallet?.address.substring(0, 6) +
    "...." +
    wallet?.address.substring(wallet.address.length - 6);

  useEffect(() => {
    setAccountLoading(true);
    async function connectToWeb5() {
      try {
        const { web5: userWeb5 } = await initWeb5({ password: sessionKey });
        setWeb5(userWeb5);
      } catch (err) {
        console.log(err);
      }
    }
    connectToWeb5();
  }, [reload]);

  useEffect(() => {
    const fetchWalletFromDwn = async () => {
      if (web5) {
        try {
          const response = await getAddressFromDwn({ web5 });
          const data = await response![0].data.json();
          const decryptWalletInfo = decryptData({ data: data.wallet });
          const parsedWalletInfo = JSON.parse(decryptWalletInfo);
          setWallet(parsedWalletInfo);
          await fetchBitcoinInfo({ address: parsedWalletInfo.address }).then(
            async (res: any) => {
              if (res) {
                const walletBalance =
                  res.chain_stats.funded_txo_sum / 100000000;
                if (walletBalance <= 0) {
                  setBalance(0.000001);
                } else {
                  setBalance(walletBalance);
                }

                //Api to get the current price of btc
                await axios
                  .get(
                    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
                  )
                  .then((rate) => {
                    const walletBalanceInUsd =
                      (res.chain_stats.funded_txo_sum / 100000000) *
                      rate.data.bitcoin.usd;
                    if (walletBalanceInUsd > 0) {
                      setBalanceInUsd(walletBalanceInUsd);
                    } else {
                      setBalanceInUsd(0.0001);
                    }
                  });
              }
            }
          );
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
      <h1 className='text-base font-bold mb-4'>Hi, Welcome 👋</h1>

      <div>
        <div className='mb-4 flex items-center gap-2'>
          <Image alt='bitcoin' src='/btc.svg' width={38} height={38} />
          <h2 className='font-medium'> Decentralized Account</h2>
        </div>
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
            <div className='flex gap-1.5 w-fit'>
              <div className='w-fit'>
                {balance && (
                  <>
                    <h2 className='text-2xl font-bold max-sm:text-xl'>
                      {balanceVisible ? `${balance} BTC` : "******"}
                    </h2>
                    <h3 className='text-base font-medium'>
                      {balanceVisible && balanceInUsd
                        ? `$${parseFloat(balanceInUsd.toFixed(2))}`
                        : "******"}
                    </h3>
                  </>
                )}
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

      <div className='bg-white rounded-xl p-6 mt-12'>
        <h2 className='font-semibold mb-6'>Quick Actions</h2>
        <div className='flex items-center gap-4 bg-white w-full overflow-x-auto hide-scrollbar'>
          <QuickAction
            title='Send Bitcoin'
            description='Send btc tokens instantly and securely to anyone, anywhere.'
            imageSrc='/send.svg'
            onClick={() => wallet && setSendModalOpen(true)}
          />
          <QuickAction
            title='Swap'
            description='Swap between crypto, fiat, and forex seamlessly for onramp, offramp transactions.'
            imageSrc='/bill.svg'
            onClick={() => {
              router.push("/dashboard/swap");
            }}
          />
          <QuickAction
            title='Orders'
            description='View your complete history of onramp, offramp, and transaction orders.'
            imageSrc='/receipt.svg'
            onClick={() => {
              router.push("/dashboard/orders");
            }}
          />
        </div>
      </div>

      <div>
        <DashboardTab wallet={wallet!} />
      </div>
      <CreateBTCModal
        web5={web5!}
        open={open}
        closeModal={() => {
          setOpen(false);
          setReload(!reload);
        }}
      />
      <SendBtcModal
        wallet={wallet!}
        amountAvailable={balance!}
        open={sendModalOpen}
        setClose={() => setSendModalOpen(false)}
      />
    </Content>
  );
}
