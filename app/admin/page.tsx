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
import PfiManager from "@/components/pfi/PfiManager";
import axiosInstance from "@/lib/axios";

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
  useEffect(() => {
    // axiosInstance.post('api/pairs', {
    //   type: 'on-ramp',
    //   offering: 'USA/BTC'
    // }).then((res)=>{
    //   console.log(res.data)
    // })

    // axiosInstance.get('api/pairs').then((res)=>{
    //   console.log(res.data)
    // })

    // axiosInstance
    //   .delete("api/pairs", {
    //     data: {
    //       offering: "USA/BTC",
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //   });
  });
  const { status } = useSession();
  const router = useRouter();

  const onChange = (key: string) => {
    console.log(key);
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
    <main className='min-h-[90vh] px-4'>
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
