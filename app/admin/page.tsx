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
} from "@ant-design/icons";
import PfiManager, { PfiDataTypes } from "@/components/pfi/PfiManager";
import ManageOffers from "@/components/pair-manager/ManageOfferings";
import Metrics from "@/components/metrics/Metrics";
import axiosInstance from "@/lib/axios";
import Messages from "@/components/admin-support/Messages";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import initWeb5 from "@/web5/auth/access";
import { type Record, type Web5 } from "@web5/api";

export default function Admin() {
  const sessionKey = decryptAndRetrieveData({ name: "adminKey" });
  const router = useRouter();
  const [pfis, setPfis] = useState<PfiDataTypes[]>();
  const [pairs, setPairs] = useState();
  const [web5, setWeb5] = useState<Web5>();
  const [userDid, setUserDid] = useState<string>();
  const [isPfiLoading, setIsPfiLoading] = useState(false);
  const [isPairLoading, setIsPairLoading] = useState(false);
  const [isConvoLoading, setIsConvoLoading] = useState(false);
  const [conversations, setConversations] = useState<Record[]>([]);
  const [reloadPfi, setReloadPfi] = useState(false);
  const [reloadPair, setReloadPair] = useState(false);

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
    setIsConvoLoading(true);

    async function handleWeb5() {
      const { web5, userDID } = await initWeb5({ password: sessionKey });
      setWeb5(web5);
      setUserDid(userDID);

      if (web5 && userDID) {
        await fetchConversation(web5);
      }
      setIsConvoLoading(false);
    }
    sessionKey && handleWeb5();
  }, [sessionKey]);

  // Function to query DWN for available conversations.
  const fetchConversation = async (web5: Web5) => {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: "https://wallet.chain.com/",
        },
      },
    });

    console.log(response.records);
    if (response.status.code === 200) {
      if (response.records && response.records?.length > 0) {
        setIsConvoLoading(true);
        setConversations(response.records);
        console.log("Conversations", response.records);
      }
    }
  };

  // Handle reloads of Tabs
  const setReloadForPair = () => {
    setReloadPair(!reloadPair);
  };
  const setReloadForPfi = () => {
    setReloadPfi(!reloadPfi);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Metrics",
      icon: <PieChartOutlined />,
      children: <Metrics pfis={pfis!} />,
    },
    {
      key: "2",
      label: "Manage PFIs",
      icon: <BankOutlined />,
      children: (
        <PfiManager
          isPfiLoading={isPfiLoading}
          pfis={pfis!}
          setReload={setReloadForPfi}
        />
      ),
    },
    {
      key: "3",
      label: "Available Offerings",
      icon: <DollarOutlined />,
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
        <Button
          className='font-semibold'
          onClick={() => {
            sessionStorage.clear();
            router.push("/admin/auth");
          }}>
          Logout
        </Button>
      </div>

      <div>
        <Tabs className='px-6 max-sm:px-0' defaultActiveKey='1' items={items} />
      </div>
    </main>
  );
}
