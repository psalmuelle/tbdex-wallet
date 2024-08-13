"use client";

import { UserOutlined } from "@ant-design/icons";
import { Layout } from "antd";

const { Header } = Layout;

export default function DashboardHeader() {
  return (
    <Header className='bg-white flex justify-between items-center'>
      <h1 className='font-bold'>Dashboard</h1>

      <div>
        <UserOutlined />
        <p>USER DID</p>
      </div>
    </Header>
  );
}
