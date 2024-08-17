"use client";
import {
  CommentOutlined,
  DollarOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  LogoutOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const { Sider } = Layout;
const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
  zIndex: 400,
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/dashboard",
    label: <Link href={"/dashboard"}>Home</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: "/dashboard/swap",
    label: <Link href={"/dashboard/swap"}>Swap</Link>,
    icon: <SwapOutlined />,
  },
  {
    key: "3",
    label: <Link href={"/dashboard"}>Order</Link>,
    icon: <DollarOutlined />,
  },
  {
    key: "4",
    label: <Link href={"/dashboard"}>Messages</Link>,
    icon: <CommentOutlined />,
  },
  {
    key: "5",
    label: <Link href={"/dashboard"}>Transaction History</Link>,
    icon: <HistoryOutlined />,
  },
  {
    key: "/dashboard/kcc",
    label: <Link href={"/dashboard/kcc"}>KCC</Link>,
    icon: <IdcardOutlined />,
  },
  {
    key: "/",
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
  const pathName = usePathname();

  return (
    <Sider
      breakpoint='sm'
      collapsible
      onCollapse={(value) => setCollapsed(value)}
      theme='light'
      style={siderStyle}>
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

      <Menu mode='inline' defaultSelectedKeys={[pathName]} items={items} />
    </Sider>
  );
}
