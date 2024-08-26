"use client";

import { Button, Layout, Steps } from "antd";
import SwapType from "@/components/swap/SwapType";
import SwapPairs from "@/components/swap/SwapPairs";
import { useState, useEffect } from "react";
import Offerings from "@/components/swap/Offerings";
import { ArrowLeftOutlined, BankOutlined } from "@ant-design/icons";
import { ManageKnownCustomerCredentials } from "@/lib/web5/kcc";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import { useSwapForm } from "@/hooks/useSwap";

const { Content } = Layout;

export default function Swap() {
  const [current, setCurrent] = useState(0);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [credentials, setCredentials] = useState<string[]>([]);
  const setSwapForm = useSwapForm((state) => state.setSwapForm);

  useEffect(() => {
    async function fetchCredentials() {
      (await ManageKnownCustomerCredentials({ password: sessionKey }))
        .get()
        .then((res) => {
          if (res?.records && res.records.length > 0) {
            res.records[0].data.text().then((data: string) => {
              setCredentials([data]);

              //Scenario: User has completed KYC and has offerings in local storage
              const swapInfo = localStorage.getItem("offering");
              if (swapInfo === null) return;
              const { to, from, amount } = JSON.parse(swapInfo!);
              setSwapForm({ to: to, from: from, amount: amount });
              setCurrent(1);
            });
          }
        });
    }

    fetchCredentials();
  }, []);

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
          <Offerings credentials={credentials} />
        </div>
      )}
    </Content>
  );
}
