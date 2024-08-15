"use client";
import { useSession, signOut } from "next-auth/react";
import { Button, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BankOutlined,
  StarOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axiosInstance from "@/lib/axios";
import PfiManager from "@/components/PfiManager";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Manage PFIs",
    icon: <BankOutlined />,
    children: <PfiManager />,
  },
  {
    key: "2",
    label: "Customer Ratings",
    icon: <StarOutlined />,
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Messages",
    icon: <MessageOutlined />,
    children: "Content of Tab Pane 3",
  },
];

export default function Admin() {
  const { status } = useSession();
  const router = useRouter();

  const onChange = (key: string) => {
    console.log(key);
  };

  const testApi = () => {
    //   axiosInstance.post("/api/pfis", {
    //   name: "Abaru Company",
    //   did: "did:example:1123121",
    // }).then(res=> console.log(res))
    // axiosInstance.get("/api/pfis?pfiDid=did:example:1123121").then(res=> console.log(res))
    // axiosInstance.delete("/api/pfis", {data: {did: 'did:example:123aszz'}}).then(res=> console.log(res))
    // axiosInstance.post('/api/orders', {
    //   userDid: 'did:example:123221',
    //   pfiDid: 'did:example:1123121',
    //   status: 'failed',
    //   rating: 0,
    //   review: 'Nice!'
    // }).then(res=> console.log(res))
    //  axiosInstance.get('/api/orders?pfiDid=did:example:1123121').then(res=> console.log(res))
    // axiosInstance.get('/api/orders').then(res=> console.log(res))
  };

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
    <main className='min-h-[80vh] px-4'>
      <div className='flex justify-between items-center gap-4 p-6 max-sm:p-4'>
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
          className='px-6'
          defaultActiveKey='1'
          onChange={onChange}
          items={items}
        />
      </div>
    </main>
  );
}
