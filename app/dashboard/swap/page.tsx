"use client";

import { Layout } from "antd";
import SwapType from "@/components/swap/SwapType";
import SwapPairs from "@/components/swap/SwapPairs";
import Offerings from "@/components/swap/Offerings";

const { Content } = Layout;

export default function Swap() {
  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Swap</h1>
      <SwapType />
      <SwapPairs />
      <Offerings />
    </Content>
  );
}
