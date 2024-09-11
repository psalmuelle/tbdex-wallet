"use client";
import type { Record } from "@web5/api";
import ConversationList from "./ConversationList";
import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import ChatBox from "../messages/ChatBox";
import { LeftOutlined } from "@ant-design/icons";

export default function Messages({
  loading,
  conversations,
}: {
  loading: boolean;
  conversations: Record[];
}) {
  const [convo, setConvo] = useState<
    { user: string; text: string; time: string }[]
  >([]);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    function getMessages() {
      const temp: { user: string; time: string; text: string }[] = [];
      conversations.map(async (conversation) => {
        conversation.data.json().then((res) => {
          temp.push({
            user: res.user,
            time: conversation.dateCreated,
            text: res.title,
          });
          setConvo(temp);
        });
      });
    }
    getMessages();
  }, []);

  return (
    <div>
      <h1 className='font-semibold mt-6'>Customers Messages</h1>
      <div className='mt-8 p-4 bg-white w-full rounded-xl min-h-96'>
        {!openChat ? (
          loading ? (
            <>
              <div className='flex justify-center items-center min-h-48'>
                <Spin spinning={loading} size='large' />
              </div>
            </>
          ) : (
            <ConversationList
              conversations={convo}
              handleOpenChat={() => setOpenChat(true)}
            />
          )
        ) : (
          <div className="mb-8">
            <Button
              shape='circle'
              type={"text"}
              icon={<LeftOutlined />}
              onClick={() => setOpenChat(false)}
            />
            <ChatBox />
          </div>
        )}
      </div>
    </div>
  );
}
