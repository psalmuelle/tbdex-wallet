"use client";
import type { Record, Web5 } from "@web5/api";
import ConversationList from "./ConversationList";
import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import ChatBox from "../messages/ChatBox";
import { LeftOutlined } from "@ant-design/icons";

const test = [
  {
    msg: "Hi, how can I help you?",
    time: "10:00 AM",
    isUser: false,
    adminName: "Abby",
    id: "jkasfkljasofi",
  },
  {
    msg: "I have issues while converting currencies/token 🤔",
    time: "10:01 AM",
    isUser: true,
    id: "uiewyhieciwe",
  },
  {
    msg: "I want to report a bug 🐞",
    time: "10:02 AM",
    isUser: true,
    id: "c,znxmvbm,zxv",
  },
];

export default function Messages({
  loading,
  conversations,
  web5,
}: {
  loading: boolean;
  conversations: Record[];
  web5: Web5;
}) {
  const [convo, setConvo] = useState<
    { id: string; user: string; text: string; time: string }[]
  >([]);
  const [openChat, setOpenChat] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>();

  useEffect(() => {
    function getMessages() {
      const temp: { id: string; user: string; time: string; text: string }[] =
        [];
      conversations.map(async (conversation) => {
        await conversation.data.json().then((res) => {
          temp.push({
            id: conversation.id,
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

  useEffect(() => {
    async function fetchChats() {
      // fetch chats for the selected user
    }
  }, []);

  const handleSendMessage = async () => {
    // send message to the user
  };

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
              handleOpenChat={(id: string) => {
                setCurrentChatId(id);
                setOpenChat(true);
              }}
            />
          )
        ) : (
          <div className='mb-8'>
            <Button
              shape='circle'
              type={"text"}
              icon={<LeftOutlined />}
              onClick={() => setOpenChat(false)}
            />
            <ChatBox
              isUser={false}
              adminName='Sam'
              parentId={currentChatId!}
              web5={web5}
              messages={test}
            />
          </div>
        )}
      </div>
    </div>
  );
}
