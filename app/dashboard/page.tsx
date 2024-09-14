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
import shortenText from "@/lib/shortenText";
import FundWalletModal from "@/components/dashboard/FundWalletModal";
import Wallets from "@/components/dashboard/Wallets";
import CreateFiatsModal from "@/components/dashboard/CreateFiatsAccount";

const { Content } = Layout;

const allWallets = [
  {
    id: "1",
    type: "KES",
    logo: "https://img.icons8.com/?size=100&id=RiWEw0nK1EZP&format=png&color=000000",
  },
  {
    id: "2",
    type: "USD",
    logo: "https://img.icons8.com/?size=100&id=fIgZUHgwc76e&format=png&color=000000",
  },
  {
    id: "3",
    type: "EUR",
    logo: "https://img.icons8.com/?size=100&id=Y76SzpmxslW4&format=png&color=000000",
  },
  {
    id: "4",
    type: "BTC",
    logo: "https://img.icons8.com/?size=100&id=XDum8M4mrAZQ&format=png&color=000000",
  },
];

interface BalanceProps {
  KES: number | undefined;
  USD: number | undefined;
  EUR: number | undefined;
  BTC: number | undefined;
}

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
  const [activeBalance, setActiveBalance] = useState("KES");
  const [balance, setBalance] = useState<number>();
  const [balanceInUsd, setBalanceInUsd] = useState<number>();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [reloadWallets, setReloadWallets] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [fundWalletModalOpen, setFundWalletModalOpen] = useState(false);
  const [createFiatsModalOpen, setCreateFiatsModalOpen] = useState(false);
  type BalanceKeys = "KES" | "USD" | "EUR" | "BTC";

  const [allBalances, setAllBalances] = useState<BalanceProps>({
    KES: undefined,
    USD: undefined,
    EUR: undefined,
    BTC: undefined,
  });

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
    const fetchBtcWalletFromDwn = async () => {
      if (!web5) return;
      try {
        const response = await getAddressFromDwn({ web5 });
        const data = await response![0].data.json();
        const decryptWalletInfo = decryptData({ data: data.wallet });
        const parsedWalletInfo = JSON.parse(decryptWalletInfo);
        setWallet(parsedWalletInfo);
        await fetchBitcoinInfo({ address: parsedWalletInfo.address }).then(
          async (res: any) => {
            if (res) {
              const balArray = res.map((tnx: { value: number }) => {
                return tnx.value;
              });
              const balInSatoshi = balArray.reduce(
                (acc: number, current: number) => acc + current,
                0
              );

              const walletBalance = balInSatoshi / 100000000;
              if (walletBalance <= 0) {
                setAllBalances({ ...allBalances, BTC: 0.000001 });
              } else {
                setAllBalances({ ...allBalances, BTC: walletBalance });
              }
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
      setAccountLoading(false);
    };

    fetchBtcWalletFromDwn();
  }, [web5]);

  useEffect(() => {
    async function fetchFiatAccounts() {
      if (!web5) return;
      try {
        const response = await web5.dwn.records.query({
          message: {
            filter: {
              schema: "BankAccountsInfo",
              dataFormat: "application/json",
            },
          },
        });
        //Come here
        if (!response.records) return;
        response.records.map(async (record: any) => {
          const data = await record.data.json();
          console.log(data);
        });
      } catch (err) {
        console.log(err);
      }
    }
    fetchFiatAccounts();
  }, [web5, reloadWallets]);

  return (
    <Content className='mt-8 mx-4'>
      <h1 className='font-bold mb-4'>Hi, Welcome 👋</h1>

      <Wallets
        handleActiveBalance={(e) => setActiveBalance(e)}
        activeBalance={activeBalance}
        balances={allWallets}
        loadingBalance={accountLoading}
        balance={allBalances[activeBalance as BalanceKeys]}
        handleFundWallet={() => {
          if (activeBalance === "BTC") {
            setFundWalletModalOpen(true);
          } else {
            //Im coming back here!
          }
        }}
        handleSendMoney={() => {
          if (activeBalance === "BTC") {
            setSendModalOpen(true);
          } else {
            //Im coming back here!
          }
        }}
        handleCreateAccount={() => {
          if (activeBalance === "BTC") {
            setOpen(true);
          } else {
            setCreateFiatsModalOpen(true);
          }
        }}
      />

      {/* <div>
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
        {wallet && !accountLoading && (
          <>
            <div className='mt-3 mb-2'>
              <Typography.Text
                copyable={{ text: wallet.address }}
                className='bg-white rounded-xl px-2 py-1'>
                {shortenText(wallet?.address, 6, 6)}
              </Typography.Text>
            </div>
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
            <Button
              size='large'
              type='primary'
              shape={"round"}
              onClick={() => setFundWalletModalOpen(true)}
              className='my-4'>
              Fund wallet
            </Button>
          </>
        )}
        {wallet === undefined && !accountLoading && (
          <Button type='primary' className='mt-2' onClick={() => setOpen(true)}>
            Create Bitcoin Wallet
          </Button>
        )}
      </div> */}

      <div className='bg-white rounded-xl p-6 max-sm:p-4 mt-12'>
        <h2 className='font-semibold mb-6'>Quick Actions</h2>
        <div className='flex items-center gap-4 bg-white w-full overflow-x-auto hide-scrollbar'>
          <QuickAction
            title='Send Money'
            description='Send across the globe with ease and speed using our decentralized wallet.'
            imageSrc='/send.svg'
            onClick={() => router.push("/dashboard/send")}
          />
          <QuickAction
            title='Convert'
            description='Swap between crypto, fiat, and forex seamlessly for onramp, offramp transactions.'
            imageSrc='/bill.svg'
            onClick={() => {
              router.push("/dashboard/convert");
            }}
          />
          <QuickAction
            title='Transfer BTC'
            description='Transfer Bitcoin to other wallets or users with ease and speed.'
            imageSrc='https://img.icons8.com/?size=100&id=7xqkdDZOH9Hv&format=png&color=000000'
            onClick={() => wallet && setSendModalOpen(true)}
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
        <DashboardTab
          activeWallet={activeBalance as "USD" | "KES" | "EUR" | "BTC"}
          wallet={wallet!}
        />
      </div>
      <CreateBTCModal
        web5={web5!}
        open={open}
        closeModal={() => {
          setOpen(false);
          setReload(!reload);
        }}
      />
      <CreateFiatsModal
        open={createFiatsModalOpen}
        handleClose={() => setCreateFiatsModalOpen(false)}
        reloadWallets={() => setReloadWallets(!reloadWallets)}
        activeWallet={activeBalance as "USD" | "KES" | "EUR" | "BTC"}
        web5={web5!}
      />
      <SendBtcModal
        wallet={wallet!}
        amountAvailable={balance!}
        open={sendModalOpen}
        setClose={() => setSendModalOpen(false)}
      />
      <FundWalletModal
        open={fundWalletModalOpen}
        onClose={() => setFundWalletModalOpen(false)}
        walletAddress={wallet?.address!}
      />
    </Content>
  );
}
