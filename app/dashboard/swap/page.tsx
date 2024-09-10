"use client";

import { Button, Layout, Radio, Steps } from "antd";
import SwapType from "@/components/swap/SwapType";
import SwapPairs, { PairType } from "@/components/swap/SwapPairs";
import { useState, useEffect } from "react";
import Offerings from "@/components/swap/Offerings";
import {
  ArrowLeftOutlined,
  BankOutlined,
  CreditCardOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import getKcc from "@/web5/kcc/read";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import { useSwapForm } from "@/hooks/useSwap";
import PaymentDetails from "@/components/swap/PaymentDetails";
import Image from "next/image";
import { useRouter } from "next/navigation";
import initWeb5 from "@/web5/auth/access";
import type { Web5 } from "@web5/api";
import axiosInstance from "@/lib/axios";

const { Content } = Layout;

export default function Swap() {
  const [current, setCurrent] = useState(0);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [web5, setWeb5] = useState<Web5>();
  const [userDid, setUserDid] = useState<string>();
  const [credentials, setCredentials] = useState<string[]>([]);
  const [pairs, setPairs] = useState<PairType[]>([]);
  const setSwapForm = useSwapForm((state) => state.setSwapForm);
  const [rfqId, setRfqId] = useState("");
  const router = useRouter();

  //Initialize web5
  useEffect(() => {
    if (!sessionKey) return;
    async function initializeWeb5() {
      try {
        const { web5, userDID } = await initWeb5({ password: sessionKey });
        setWeb5(web5);
        setUserDid(userDID);
      } catch (err) {
        console.log(err);
      }
    }
    initializeWeb5();

    //Scenario: User has completed KYC and has offerings in local storage
    const swapInfo = localStorage.getItem("offering");
    if (swapInfo === null) return;
    const { to, from, amount } = JSON.parse(swapInfo!);
    setSwapForm({ to: to, from: from, amount: amount });
    setCurrent(1);
    localStorage.removeItem("offering");
  }, [sessionKey]);

  //Fetch Known Customer Credential
  useEffect(() => {
    async function fetchUserCredential() {
      if (!web5) return;
      try {
        const response = await getKcc({ web5 });

        if (response?.records && response.records.length > 0) {
          await response.records[0].data.text().then((data: string) => {
            setCredentials([data]);
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserCredential();
  }, [web5]);

  //Get available pairs
  useEffect(() => {
    async function fetchPairs() {
      await axiosInstance.get("/api/pairs").then((res) => {
        setPairs(res.data.pairs);
      });
    }
    fetchPairs();
  }, []);

  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Swap</h1>
      <div className='w-fit mx-auto flex flex-col justify-center items-center p-8 mt-6 mb-24 rounded-xl bg-white'>
        <Steps
          progressDot
          current={current}
          className='mt-6'
          size='small'
          responsive
          items={[
            {
              title: "Select Pair",
            },
            {
              title: "Choose Offering",
            },
            {
              title: "Payment Details",
            },
            {
              title: "Order",
            },
          ]}
        />
        {current === 0 && (
          <div className=' flex flex-col justify-center items-center p-6 mt-8 mb-6 border rounded-xl'>
            <SwapType />
            <SwapPairs pairs={pairs} setNextStep={() => setCurrent(1)} />
          </div>
        )}
        {current === 1 && (
          <div className='p-8 mt-6 mb-24 rounded-xl bg-neutral-50 border shadow'>
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
            <Offerings
              credentials={credentials}
              setNextStep={() => setCurrent(2)}
            />
          </div>
        )}

        {current === 2 && (
          <div className='p-8 mt-6 mb-24 rounded-xl bg-neutral-50 border shadow'>
            <div className='flex justify-between items-center mb-6'>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => setCurrent(1)}
              />
              <h1 className='font-semibold text-center'>
                <span>
                  <CreditCardOutlined className='text-xl' />
                </span>{" "}
                Payment Details
              </h1>
              <div />
            </div>
            <div>
              <h2 className='font-medium mb-2'>
                Choose a payment method to complete the swap
              </h2>
              <PaymentDetails
                credentials={credentials}
                setNext={() => setCurrent(3)}
                setRfqId={(id: string) => setRfqId(id)}
              />
            </div>
          </div>
        )}
        {current === 3 && (
          <div className='p-8 mt-6 mb-24 rounded-xl bg-neutral-50 border shadow flex flex-col justify-center items-center gap-4'>
            <Image
              src={"/rocket-in-flight.png"}
              alt='Success'
              height={150}
              width={150}
            />
            <div>
              <h1 className='text-xl font-semibold text-center'>
                Order placed successfully!
              </h1>
              <p className='text-center'>
                Your order has been successfully placed. Go to the orders page
                to initiate the transaction
              </p>
              <div className='mx-auto my-8 w-full flex justify-center items-center'>
                <Button
                  onClick={() => router.push(`/dashboard/orders?id=${rfqId}`)}
                  type='primary'
                  size='large'
                  className='w-full max-w-xs'>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
}
