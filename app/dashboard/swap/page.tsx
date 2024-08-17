"use client";

import { useState } from "react";
import { Button, Layout } from "antd";
import SwapType from "@/components/swap/SwapType";
import { useSwapType } from "@/hooks/useSwap";

const { Content } = Layout;


export default function Swap() {

   const activeSwapType = useSwapType((state)=> state.swapType)

  return (
    <Content className='mt-8 mx-4'>
      <SwapType />
    </Content>
  );
}
