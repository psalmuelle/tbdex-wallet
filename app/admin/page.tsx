"use client";
import { useSession, signOut } from "next-auth/react";
import { Button, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BankOutlined,
  UserOutlined,
  MessageOutlined,
  DollarOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import PfiManager from "@/components/pfi/PfiManager";
import ManageOffers from "@/components/pair-manager/ManageOfferings";
import Metrics from "@/components/metrics/Metrics";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Metrics",
    icon: <PieChartOutlined />,
    children: <Metrics />,
  },
  {
    key: "2",
    label: "Manage PFIs",
    icon: <BankOutlined />,
    children: <PfiManager />,
  },
  {
    key: "3",
    label: "Available Offerings",
    icon: <DollarOutlined />,
    children: <ManageOffers />,
  },
  {
    key: "4",
    label: "Messages",
    icon: <MessageOutlined />,
    children: "Content of Tab Pane 2",
  },
];

export default function Admin() {
  const { status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      router.push("/admin/auth");
    }
  }, [status]);

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
        <Tabs
          className='px-6 max-sm:px-0'
          defaultActiveKey='1'
          items={items}
        />
      </div>
    </main>
  );
}
