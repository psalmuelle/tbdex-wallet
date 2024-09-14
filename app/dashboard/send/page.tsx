"use client";

import { Layout } from "antd";

const { Content } = Layout;

export default function Send() {
  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Send Money</h1>
      <div className='bg-white rounded-xl mt-12 mb-8 p-4'>
        This is going to be send page where users can send money to other users
        and also to other wallets.
      </div>
    </Content>
  );
}
