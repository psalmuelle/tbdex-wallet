"use client";

import { Layout } from "antd";



const { Content } = Layout;

export default function Dashboard() {
  return (
    <Content className='mt-8 mx-4'>
      <h1 className="text-base font-bold mb-4">Dashboard</h1>
      <p>this is the body of the dashboard</p>
    </Content>
  );
}
