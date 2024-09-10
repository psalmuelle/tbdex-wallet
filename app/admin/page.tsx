"use client";
import { Button, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BankOutlined,
  UserOutlined,
  MessageOutlined,
  DollarOutlined,
  PieChartOutlined,
  TagsOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import PfiManager, { PfiDataTypes } from "@/components/pfi/PfiManager";
import ManageOffers from "@/components/pair-manager/ManageOfferings";
import Metrics from "@/components/metrics/Metrics";
import axiosInstance from "@/lib/axios";
import Messages from "@/components/admin-support/Messages";
import { decryptAndRetrieveData, decryptData } from "@/lib/encrypt-info";
import initWeb5 from "@/web5/auth/access";
import { type Record, type Web5 } from "@web5/api";
import getMessages from "@/web5/messages/read";
import Revenue from "@/components/admin-revenue/Revenue";
import { getAddressFromDwn } from "@/lib/web3/getAddressFromDwn";
import { fetchBitcoinInfo } from "@/lib/web3/tnx.bitcoin";
import axios from "axios";

export default function Admin() {
  const sessionKey = decryptAndRetrieveData({ name: "adminKey" });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("1");
  const [pfis, setPfis] = useState<PfiDataTypes[]>();
  const [pairs, setPairs] = useState();
  const [web5, setWeb5] = useState<Web5>();
  const [userDid, setUserDid] = useState<string>();
  const [isPfiLoading, setIsPfiLoading] = useState(false);
  const [isPairLoading, setIsPairLoading] = useState(false);
  const [btcWalletLoading, setBtcWalletLoading] = useState(false);
  const [isConvoLoading, setIsConvoLoading] = useState(false);
  const [conversations, setConversations] = useState<Record[]>([]);
  const [wallet, setWallet] = useState<{
    address: string;
    privateKey: string;
    xpub: string;
  }>();
  const [balance, setBalance] = useState<number>();
  const [balanceInUsd, setBalanceInUsd] = useState<number>();
  const [reloadPfi, setReloadPfi] = useState(false);
  const [reloadPair, setReloadPair] = useState(false);
  const [reloadWallet, setReloadWallet] = useState(false);

  // For navigating to login page if sessionKey is not available
  useEffect(() => {
    if (!sessionKey) {
      router.push("/admin/auth");
    }
  }, [sessionKey]);

  // For fetching PFIs
  useEffect(() => {
    setIsPfiLoading(true);
    const fetchPfis = async () => {
      await axiosInstance.get("api/pfis").then((res) => {
        setPfis(res.data.pfi);
        setIsPfiLoading(false);
      });
    };
    fetchPfis();
  }, [reloadPfi]);

  // For Loading Pairs Available
  useEffect(() => {
    async function fetchData() {
      setIsPairLoading(true);
      await axiosInstance.get("api/pairs").then((res) => {
        const newData = res.data.pairs.map(
          (pair: { offering: string; type: string }, i: number) => ({
            key: i + 1,
            pair: pair.offering,
            type: pair.type,
          })
        );
        setPairs(newData);

        setIsPairLoading(false);
      });
    }

    fetchData();
  }, [reloadPair]);

  // For fetching Conversations/Messages
  useEffect(() => {
    setBtcWalletLoading(true);
    async function handleWeb5() {
      const { web5, userDID } = await initWeb5({ password: sessionKey });
      setWeb5(web5);
      setUserDid(userDID);
    }
    sessionKey && handleWeb5();
  }, [sessionKey]);

  useEffect(() => {
    setBtcWalletLoading(true);
    async function fetchWalletFromDwn() {
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
              const walletBalance = res.chain_stats.funded_txo_sum / 100000000;
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
              setBtcWalletLoading(false);
            }
          }
        );
      } catch (err) {
        console.log(err);
        setBtcWalletLoading(false);
      }
    }
    fetchWalletFromDwn();
  }, [web5, reloadWallet]);

  // Handle reloads of Tabs
  const setReloadForPair = () => {
    setReloadPair(!reloadPair);
  };
  const setReloadForPfi = () => {
    setReloadPfi(!reloadPfi);
  };

  // Tabs
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Metrics",
      icon: <PieChartOutlined />,
      children: (
        <Metrics
          balance={balance!}
          pfis={pfis!}
          balanceLoading={btcWalletLoading}
          userDid={userDid!}
          goToRevenue={() => {
            setActiveTab("5");
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Manage PFIs",
      icon: <BankOutlined />,
      children: (
        <PfiManager
          userDid={userDid!}
          isPfiLoading={isPfiLoading}
          pfis={pfis!}
          setReload={setReloadForPfi}
        />
      ),
    },
    {
      key: "3",
      label: "Available Offerings",
      icon: <TagsOutlined />,
      children: (
        <ManageOffers
          isPairLoading={isPairLoading}
          pairs={pairs}
          setReload={setReloadForPair}
        />
      ),
    },
    {
      key: "4",
      label: "Messages",
      icon: <MessageOutlined />,
      children: (
        <Messages loading={isConvoLoading} conversations={conversations!} />
      ),
    },
    {
      key: "5",
      label: "Revenue",
      icon: <DollarOutlined />,
      children: (
        <Revenue
          web5={web5!}
          wallet={wallet!}
          balance={balance!}
          balanceInUsd={balanceInUsd!}
          balanceLoading={btcWalletLoading}
          setReload={() => setReloadWallet(!reloadWallet)}
        />
      ),
    },
  ];

  if (!sessionKey) {
    return (
      <main className='min-h-[90vh] px-4'>
        <Spin fullscreen size='large' />
      </main>
    );
  }

  return (
    <main className='min-h-[90vh] px-4'>
      <div className='flex justify-between items-center gap-4 p-6 max-sm:px-0'>
        <div className='flex justify-center items-center gap-2 font-semibold'>
          <Button icon={<UserOutlined />} type='dashed' shape='circle' />
          <p>Welcome 👋!</p>
        </div>
        {userDid && (
          <div>
            <Button
              shape='circle'
              onClick={() => {
                sessionStorage.clear();
                router.push("/admin/auth");
              }}
              danger
              type='dashed'
              icon={<LogoutOutlined />}
            />
          </div>
        )}
      </div>

      <div>
        <Tabs
          className='px-6 max-sm:px-0'
          activeKey={activeTab}
          defaultActiveKey='1'
          onChange={(key) => setActiveTab(key)}
          items={items}
        />
      </div>
    </main>
  );
}
