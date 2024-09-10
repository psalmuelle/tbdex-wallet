"use client";

import {
  AccountBookOutlined,
  BankOutlined,
  DollarCircleOutlined,
  FallOutlined,
  RiseOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Card, Rate, Statistic, Skeleton, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { PfiDataTypes } from "../pfi/PfiManager";
import MetricCard from "./MetricCard";
import shortenText from "@/lib/shortenText";

export default function Metrics({
  pfis,
  userDid,
  balance,
  balanceLoading,
  goToRevenue,
}: {
  pfis: PfiDataTypes[];
  userDid: string;
  balanceLoading: boolean;
  balance: number;
  goToRevenue: () => void;
}) {
  const [activePfis, setActivePfis] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [highestOrder, setHighestOrder] = useState<string>();
  const [lowestOrder, setLowestOrder] = useState<string>();
  const [mostRated, setMostRated] = useState<
    { pfi: string; totalOrder: any[]; rating: number } | undefined
  >();
  const [leastRated, setLeastRated] = useState<
    { pfi: string; totalOrder: any[]; rating: number } | undefined
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const sortData = async () => {
      if (!pfis) return;
      const numOrders: number[] = [];
      const orderInfo: { pfi: string; totalOrder: any[]; rating: number }[] =
        [];
      const active = pfis.filter(
        (item: { isActive: boolean }) => item.isActive
      ).length;
      setActivePfis(active);
      pfis.map((pfi: any) => {
        const pfiRating = pfi.orders.map((order: any) => order.rating);
        orderInfo.push({
          pfi: pfi.name,
          totalOrder: pfi.orders,
          rating:
            pfiRating.reduce((a: number, b: number) => a + b, 0) /
            pfiRating.length,
        });

        numOrders.push(pfi.orders.length);
      });
      numOrders.sort((a, b) => a - b);
      setTotalOrders(numOrders.reduce((a, b) => a + b, 0));

      const higestOrder = orderInfo.find(
        (info) => info.totalOrder.length === Math.max(...numOrders)
      );
      const lowestOrder = orderInfo.find(
        (info) => info.totalOrder.length === Math.min(...numOrders)
      );
      const highestRated = orderInfo.reduce(
        (max, info) => (info.rating > max.rating ? info : max),
        orderInfo[0]
      );

      const lowestRated = orderInfo.reduce(
        (min, info) => (info.rating < min.rating ? info : min),
        orderInfo[0]
      );

      setHighestOrder(higestOrder?.pfi);
      setLowestOrder(lowestOrder?.pfi);
      setMostRated(highestRated);
      setLeastRated(lowestRated);

      setLoading(false);
    };
    sortData();
  }, [pfis]);
  return (
    <div className='my-6'>
      <h1 className='font-semibold mb-12'>Chain Wallet Metrics</h1>

      <div className='grid grid-cols-2 gap-4 max-w-4xl mx-auto'>
        <Typography.Text
          copyable={{ text: userDid }}
          className='p-4 font-semibold bg-white rounded-xl max-w-4xl w-fit block'>
          DID &rarr; {userDid && shortenText(userDid, 12, 4)}
        </Typography.Text>
        <Card bordered={false} className='w-full min-h-[170px] col-span-2'>
          {balanceLoading ? (
            <Skeleton className='max-w-xs mx-auto' active />
          ) : (
            <div>
              <Statistic
                className='mx-auto w-fit text-center'
                title={
                  <p>
                    Total Revenue <DollarCircleOutlined />
                  </p>
                }
                value={balance ? balance : 0}
                precision={6}
                valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
                suffix='₿'
              />
              <Button
                className='mt-4 mx-auto block'
                type='primary'
                onClick={goToRevenue}>
                {balance ? "See Transactions" : "Create BTC Wallet"}
              </Button>
            </div>
          )}
        </Card>

        <MetricCard
          loading={loading}
          title={
            <p>
              Number of Active PFIs <BankOutlined />
            </p>
          }
          value={activePfis}
        />

        <MetricCard
          loading={loading}
          title={
            <p>
              Total Number of Orders <AccountBookOutlined />
            </p>
          }
          value={totalOrders}
        />

        <MetricCard
          loading={loading}
          title={
            <p>
              PFI with Highest Orders <RiseOutlined />
            </p>
          }
          value={highestOrder!}
        />

        <MetricCard
          loading={loading}
          title={
            <p>
              PFI with Lowest Orders <FallOutlined />
            </p>
          }
          value={lowestOrder!}
        />

        <MetricCard
          loading={loading}
          title={
            <p>
              PFI with Highest Ratings <StarOutlined />
            </p>
          }
          value={mostRated?.pfi!}
          rating={mostRated?.rating}
        />

        <MetricCard
          loading={loading}
          title={
            <p>
              PFI with Lowest Ratings <StarOutlined />
            </p>
          }
          value={leastRated?.pfi!}
          rating={leastRated?.rating}
        />
      </div>
    </div>
  );
}
