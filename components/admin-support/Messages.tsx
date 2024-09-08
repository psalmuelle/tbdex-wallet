"use client";
import type { Record } from "@web5/api";
import ConversationList from "./ConversationList";
import { useEffect, useState } from "react";
import { Spin } from "antd";

export default function Messages({ loading, conversations }: { loading: boolean, conversations: Record[] }) {


  useEffect(() => {}, []);
  return (
    <div>
      <h1 className='font-semibold mt-6'>Customers Messages</h1>
      <div className='mt-8 p-4 bg-white w-full rounded-xl min-h-96'>
        {loading ? (
          <div className="flex justify-center items-center min-h-48">
            <Spin spinning={loading} size='large' />
          </div>
        ) : (
          <ConversationList conversations={conversations}/>
        )}
      </div>
    </div>
  );
}
