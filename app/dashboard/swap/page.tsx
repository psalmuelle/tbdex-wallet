"use client";

import { Button, Layout, Steps } from "antd";
import SwapType from "@/components/swap/SwapType";
import SwapPairs from "@/components/swap/SwapPairs";
import { useState } from "react";
import Offerings from "@/components/swap/Offerings";
import { ArrowLeftOutlined, BankOutlined } from "@ant-design/icons";

const { Content } = Layout;

export default function Swap() {
  const [current, setCurrent] = useState(0);

  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Swap</h1>
      <Steps
        progressDot
        current={current}
        className='max-w-2xl mt-8'
        items={[
          {
            title: "",
          },
          {
            title: "",
          },
          {
            title: "",
          },
        ]}
      />
      {current === 0 && (
        <div className='flex flex-col justify-center items-center p-8 max-w-2xl mt-6 mb-24 rounded-xl border shadow'>
          <SwapType />
          <SwapPairs setNextStep={() => setCurrent(1)} />
        </div>
      )}
      {current === 1 && (
        <div className='p-8 max-w-[800px] mt-6 mb-24 rounded-xl border shadow'>
          <div className='flex justify-between items-center mb-6'>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrent(0)}
            />
            <h1 className='font-semibold text-center'>
              <span>
                <BankOutlined className='text-xl' />{" "}
              </span>
              Offerings
            </h1>
            <div />
          </div>
          <Offerings />
        </div>
      )}
    </Content>
  );
}
