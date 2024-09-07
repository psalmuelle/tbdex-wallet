"use client";
import { useSession, signOut } from "next-auth/react";
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

export default function Admin() {
  const { status } = useSession();
  const router = useRouter();
  const [pfis, setPfis] = useState<PfiDataTypes[]>();
  const [pairs, setPairs] = useState();
  const [isPfiLoading, setIsPfiLoading] = useState(false);
  const [isPairLoading, setIsPairLoading] = useState(false);
  const [reloadPfi, setReloadPfi] = useState(false);
  const [reloadPair, setReloadPair] = useState(false);

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      router.push("/admin/auth");
    }
  }, [status]);

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
      children: "Content of Tab Pane 2",
    },
  ];

  if (status === "loading") {
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
          onClick={() => signOut({ callbackUrl: "/admin/auth" })}>
          Logout
        </Button>
      </div>

      <div>
        <Tabs className='px-6 max-sm:px-0' defaultActiveKey='1' items={items} />
      </div>
    </main>
  );
}
