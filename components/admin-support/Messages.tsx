'use client'
import type{ Web5 } from "@web5/api";
import ConversationList from "./ConversationList";
import { useEffect, useState } from "react";

export default function Messages() {
    const [web5, setWeb5] = useState<Web5>();
    const [adminDid, setAdminDid] = useState();

    useEffect(()=>{
    
    },[])
  return (
    <div>
      <h1 className='font-semibold mt-6'>Customers Messages</h1>
      <div className='mt-8 p-4 bg-white w-full rounded-xl min-h-96'>
        <ConversationList />
      </div>
    </div>
  );
}
