"use client";
import axiosInstance from "@/lib/axios";
import {
  AccountBookOutlined,
  BankOutlined,
  DollarCircleOutlined,
  FallOutlined,
  RiseOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Card, Rate, Statistic, Skeleton } from "antd";
import React, { useEffect, useState } from "react";

function MetricCard({
  value,
  title,
  rating,
  loading,
}: {
  value: string | number;
  title: React.ReactNode;
  rating?: number;
  loading: boolean;
}) {
  return (
    <Card bordered={false} className='w-full  h-[170px]'>
      {loading ? (
        <div>
          <Skeleton active />
        </div>
      ) : (
        <div>
          <Statistic
            className='mx-auto w-fit text-center'
            title={title}
            value={value}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
          />
          {rating && (
            <Rate
              className='mt-4 mx-auto block w-fit'
              disabled
              defaultValue={rating}
              allowHalf
            />
          )}
        </div>
      )}
    </Card>
  );
}

export default function Metrics() {
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
    const fetchPfis = async () => {
      const numOrders: number[] = [];
      const orderInfo: { pfi: string; totalOrder: any[]; rating: number }[] =
        [];
      await axiosInstance.get("api/pfis").then((res) => {
        const active = res.data.pfi.filter(
          (item: { isActive: boolean }) => item.isActive
        ).length;
        setActivePfis(active);
        res.data.pfi.map((pfi: any) => {
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
      });
    };
    fetchPfis();
  }, []);
  return (
    <div className='my-6'>
      <h1 className='font-semibold mb-12'>Chain Wallet Metrics</h1>
      <div className='grid grid-cols-2 gap-4 max-w-4xl mx-auto'>
        <Card bordered={false} className='w-full h-[170px] col-span-2'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                Total Revenue <DollarCircleOutlined />
              </p>
            }
            value={11.28}
            precision={6}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
            suffix='₿'
          />
          <Button className='mt-4 mx-auto block' type='primary'>
            See Transactions
          </Button>
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
