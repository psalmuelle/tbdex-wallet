'use client'
import { BankOutlined } from "@ant-design/icons";
import { Card, Spin } from "antd";
import axiosInstance from "@/lib/axios";


function OfferingCard (){
  return (
    <Card>

    </Card>
  )
}

export default function Offerings() {
  
  return (
    <section className='mt-8'>
      <h1 className='font-semibold mb-6'>
        <span>
          <BankOutlined className='text-xl' />{" "}
        </span>
        Offerings
      </h1>

      <div className='text-center mb-96'>
        <Spin className='flex justify-center items-center' />
      </div>
    </section>
  );
}
