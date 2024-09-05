"use client";

import { fetchBitcoinTnx } from "@/lib/web3/tnx.bitcoin";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Empty, Skeleton, Tag } from "antd";
import { useEffect, useState } from "react";

interface DashboardTabProps {
  wallet: {
    address: string;
    privateKey: string;
    xpub: string;
  };
}

export default function DashboardTab({ wallet }: DashboardTabProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tnxLoading, setTnxLoading] = useState(false);

  useEffect(() => {
    setTnxLoading(true);
    if (wallet) {
      fetchBitcoinTnx({ address: wallet.address }).then((res) => {
        if (res) {
          setTransactions(res);
          setTnxLoading(false);
        }
      });
    }
  }, [wallet]);

  return (
    <section className='mb-20 mt-8 bg-white rounded-xl p-6'>
      <h1 className='font-semibold'>Transaction History</h1>
      <div className='mt-8 flex flex-col gap-4'>
        {transactions.length > 0 &&
          transactions.map((tnx, i) => {
            return (
              <div
                key={i}
                className='p-4 mx-4 border rounded-xl flex justify-between gap-4 items-center cursor-pointer'>
                <div className='flex items-center gap-1 w-fit'>
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<SendOutlined />}
                  />
                  <div>
                    <p className='font-medium'>{"Bitcoin Sent"}</p>
                    <p>{(tnx.fee - 1000) / 100000000} BTC</p>
                  </div>
                </div>
                <div className='max-lg:hidden text-gray-600'>
                  TnxId: <Tag className=''>{tnx.txid}</Tag>
                </div>
                <div>
                  <p className='text-green'>
                    {tnx?.status?.confirmed ? "Success" : "Processing"}
                  </p>
                </div>
              </div>
            );
          })}
        {!tnxLoading && transactions.length === 0 && (
          <Empty description={"You do not have any transaction yet."} />
        )}
        {tnxLoading && (
          <div>
            <Skeleton.Button
              size='large'
              className='w-full'
              active={tnxLoading}
              block
            />
            <Skeleton.Button
              size='large'
              className='w-full mt-4'
              active={tnxLoading}
              block
            />
          </div>
        )}
      </div>
    </section>
  );
}
