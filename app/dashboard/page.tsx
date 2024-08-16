"use client";

import { Layout } from "antd";
import fetchPfiOfferings from "@/lib/web5/fetchPfiOferrings";



const { Content } = Layout;

export default function Dashboard() {
 fetchPfiOfferings();
  return (
    <Content className='mt-8 mx-4'>
      <h1>this is the Dashboard aod the application</h1>
      <p>this is the body of the dashboard</p>
    </Content>
  );
}
