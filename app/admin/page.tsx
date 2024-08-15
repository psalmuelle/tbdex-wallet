"use client";
import { useSession, signOut } from "next-auth/react";
import { Button, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BankOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Manage PFIs",
    icon: <BankOutlined />,
    children: "Content of Tab Pane 1",
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
    icon: <UserOutlined />,
    children: "Content of Tab Pane 3",
  },
];

export default function Admin() {
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
          className='p-6'
          defaultActiveKey='2'
          onChange={onChange}
          items={items}
        />
      </div>
    </main>
  );
}
