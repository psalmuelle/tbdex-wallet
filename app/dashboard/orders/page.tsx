"use client";
import Order from "@/components/orders/Order";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";

const { Content } = Layout;

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    //init web5
    //Get All pfiDIDs from the dwn
    //Get exchanges from those pfis
    //Get all orders from the exchanges
    // Save them to a useState
  }, []);
  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Orders</h1>
      <div className='mt-12 bg-white py-4'>
        <p className='mb-4 mx-4 font-medium'>August 22, 2024</p>
      </div>
    </Content>
  );
}
