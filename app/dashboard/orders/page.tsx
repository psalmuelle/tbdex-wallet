"use client";
import { Layout } from "antd";
import { useEffect } from "react";

const { Content } = Layout;

export default function Orders() {

    useEffect(()=>{
        console.log('Orders page loaded');
    },[])
  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Orders</h1>
      
    </Content>
  );
}
