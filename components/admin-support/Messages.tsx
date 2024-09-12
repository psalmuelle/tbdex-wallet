"use client";
import type { Record, Web5 } from "@web5/api";
import ConversationList from "./ConversationList";
import { useEffect, useState } from "react";
import { Button, Spin, Typography } from "antd";
import ChatBox from "../messages/ChatBox";
import { LeftOutlined } from "@ant-design/icons";
import { getChats } from "@/web5/messages/read";
import shortenText from "@/lib/shortenText";

type ChatProps = {
  msg: string;
  time: string;
  isUser: boolean;
  id: string;
  adminName?: string;
};

export default function Messages({
  loading,
  conversations,
  userDid,
  web5,
}: {
  loading: boolean;
  userDid: string;
  conversations: Record[];
  web5: Web5;
}) {
  const [convo, setConvo] = useState<
    { id: string; user: string; text: string; time: string }[]
  >([]);
  const [openChat, setOpenChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chats, setChats] = useState<ChatProps[]>();
  const [updatedChats, setUpdatedChats] = useState<ChatProps[]>();
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
    async function getChats() {
      const response = await fetchChats();
      setChats(response);
    }
    getChats();
  }, [web5, currentChatId]);

  useEffect(() => {
    async function updateChats() {
      if (!currentChatId) return;
      if (!openChat) return;
      const response = await fetchChats();
      if (response) {
        setUpdatedChats(response);
      }

      if (updatedChats?.length !== undefined) {
        if (updatedChats?.length > chats!.length) {
          setChats([...updatedChats]);
        }
      }
    }
    const interval = setInterval(() => {
      updateChats();
    }, 2500);
    return () => clearInterval(interval);
  }, [openChat, currentChatId, chats, updatedChats]);

  async function fetchChats() {
    try {
      // fetch chats for the selected user
      if (!web5 || !currentChatId) return;

      const details: {
        id: string;
        msg: string;
        time: string;
        isUser: boolean;
      }[] = [];

      const chats = await getChats({ web5: web5!, parentId: currentChatId });

      chats?.records?.map(async (chat) => {
        const data = await chat.data.json();

        const msgDetail = {
          id: chat.id,
          msg: data.msg,
          time: new Date(data.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          isUser: chat.author === userDid,
        };
        details.push(msgDetail);
      });
      return details;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1 className='font-semibold mt-6'>Customers Messages</h1>
      <Spin spinning={chatLoading}>
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
                  setChatLoading(true);
                  setTimeout(() => {
                    setOpenChat(true);
                    setChatLoading(false);
                  }, 500);
                }}
              />
            )
          ) : (
            <div className='mb-8'>
              <div className='flex justify-between gap-4'>
                <Button
                  shape='circle'
                  type={"text"}
                  icon={<LeftOutlined />}
                  onClick={() => {
                    setOpenChat(false);
                    setCurrentChatId(undefined);
                  }}
                />
                <Typography.Text
                  copyable={{
                    text: convo.find((c) => c.id === currentChatId)?.user!,
                  }}
                  className='font-semibold'>
                  {shortenText(
                    convo.find((c) => c.id === currentChatId)?.user!,
                    12,
                    4
                  )}
                </Typography.Text>
                <div />
              </div>
              {chats && (
                <ChatBox
                  receiverDid={convo.find((c) => c.id === currentChatId)?.user!}
                  isUser={true}
                  parentId={currentChatId!}
                  web5={web5}
                  messages={chats}
                />
              )}
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
}
