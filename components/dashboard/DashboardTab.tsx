"use client";

import { fetchBitcoinTnx } from "@/lib/web3/tnx.bitcoin";
import {
  Empty,
  Skeleton,
  Pagination,
  type PaginationProps,
} from "antd";
import { useEffect, useState } from "react";
import TransactionInfo from "./TransactionInfo";

interface DashboardTabProps {
  activeWallet: keyof TransactionsProps;
  wallet: {
    address: string;
    privateKey: string;
    xpub: string;
  };
}

type TransactionsProps = {
  BTC: any[] | undefined;
  USD: any[] | undefined;
  EUR: any[] | undefined;
  KES: any[] | undefined;
};

export default function DashboardTab({
  wallet,
  activeWallet,
}: DashboardTabProps) {
  const [transactions, setTransactions] = useState<TransactionsProps>({
    BTC: [],
    USD: [],
    EUR: [],
    KES: [],
  });
  const [tnxLoading, setTnxLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 5;

  const onPaginationChange: PaginationProps["onChange"] = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setTnxLoading(true);
        if (wallet) {
          await fetchBitcoinTnx({ address: wallet.address }).then((res) => {
            if (res) {
              setTransactions(res);
              setTransactions({ ...transactions, BTC: res });
            }
          });
        }
        setTnxLoading(false);
      } catch (err) {
        console.log(err);
        setTnxLoading(false);
      }
    }
    fetchTransactions();
  }, [wallet]);

  return (
    <section className='mb-20 mt-8 bg-white rounded-xl p-6'>
      <h1 className='font-semibold'>Transaction History</h1>
      <div className='mt-8 flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          {transactions[activeWallet] &&
            transactions[activeWallet].length > 0 &&
            transactions[activeWallet]
              .slice(startIndex, startIndex + 5)
              .map((tnx, i) => {
                const info = tnx.vout.reduce((min: any, current: any) => {
                  return current.value < min.value ? current : min;
                }, tnx.vout[0]);
                return (
                  <TransactionInfo
                    key={i}
                    status={tnx.status.confirmed ? "success" : "processing"}
                    tnxId={tnx.txid}
                    amount={info.value / 100000000}
                    type={
                      info.scriptpubkey_address === wallet.address
                        ? "In"
                        : "Out"
                    }
                  />
                );
              })}
          {transactions[activeWallet] &&
            transactions[activeWallet].length > 0 && (
              <Pagination
                pageSize={5}
                onChange={onPaginationChange}
                align='end'
                defaultCurrent={currentPage}
                total={transactions[activeWallet].length}
              />
            )}
        </div>
        {!tnxLoading &&
          transactions[activeWallet] &&
          transactions[activeWallet].length === 0 && (
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
