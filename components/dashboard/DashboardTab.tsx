"use client";

import { fetchBitcoinInfo, fetchBitcoinTnx } from "@/lib/web3/tnx.bitcoin";
import { Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface DashboardTabProps {
  wallet: {
    address: string;
    privateKey: string;
    xpub: string;
  };
}

export default function DashboardTab({ wallet }: DashboardTabProps) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    console.log("Fetching transactions");
    if (wallet) {
      fetchBitcoinInfo({ address: wallet.address });
      fetchBitcoinTnx({ address: wallet.address });
    }
  }, [wallet]);

  return (
    <section className='mb-20 mt-8'>
      <h1 className='font-semibold'>Transaction History</h1>
      <div className='mt-8'>
        <Empty description={"You do not have any transaction yet."} />
      </div>
    </section>
  );
}
