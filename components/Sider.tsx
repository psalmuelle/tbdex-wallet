"use client";
import {
  CommentOutlined,
  DollarOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "1",
    label: <Link href={"/dashboard"}>Home</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: "2",
    label: <Link href={"/dashboard"}>Order</Link>,
    icon: <DollarOutlined />,
  },
  {
    key: "3",
    label: <Link href={"/dashboard"}>Messages</Link>,
    icon: <CommentOutlined />,
  },
  {
    key: "4",
    label: <Link href={"/dashboard"}>Transaction History</Link>,
    icon: <HistoryOutlined />,
  },
  {
    key: "5",
    label: <Link href={"/dashboard"}>KCC</Link>,
    icon: <IdcardOutlined />,
  },
  {
    key: "6",
    label: (
      <Link href={"/"} onClick={() => sessionStorage.clear()}>
        Logout
      </Link>
    ),
    icon: <LogoutOutlined />,
  },
];

export default function DashboardSider() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      breakpoint='sm'
      collapsible
      onCollapse={(value) => setCollapsed(value)}
      theme='light'
      className='overflow-auto min-h-screen fixed top-0 bottom-0'>
      {collapsed ? (
        <div className='bg-neutral-100 my-4 mb-8 mx-4 rounded-lg p-2 flex justify-center items-center'>
          <Image
            src={"/logo.png"}
            width={28}
            height={28}
            alt={"Chain wallet"}
          />
        </div>
      ) : (
        <div className='bg-neutral-100 my-4 mb-8 mx-4 rounded-lg p-2 flex justify-center items-center'>
          <Image
            src={"/logo.png"}
            width={28}
            height={28}
            alt={"Chain wallet"}
          />
          <p className='font-mono font-bold'>Chain Wallet</p>
          <Image
            src={"/logo.png"}
            width={28}
            height={28}
            alt={"Chain wallet"}
          />
        </div>
      )}

      <Menu mode='inline' defaultSelectedKeys={["1"]} items={items} />
    </Sider>
  );
}
