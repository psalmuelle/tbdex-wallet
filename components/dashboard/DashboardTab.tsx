"use client";

import { Empty } from "antd";
import { useEffect, useState } from "react";

export default function DashboardTab() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    console.log("Fetching transactions");
  }, []);

  return (
    <section className='mb-20 mt-8'>
      <h1 className='font-semibold'>Transaction History</h1>
      <div className='mt-8'>
        <Empty description={"You do not have any transaction yet."} />
      </div>
    </section>
  );
}
