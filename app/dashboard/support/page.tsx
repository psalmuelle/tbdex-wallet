"use client";
import Intro from "@/components/messages/Intro";
import { Button, Layout, Popconfirm, PopconfirmProps, Spin } from "antd";
import ChatBox from "@/components/messages/ChatBox";
import { useEffect, useState } from "react";
import initWeb5 from "@/web5/auth/access";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import type { Web5, Record } from "@web5/api";
import getMessages, { getChats } from "@/web5/messages/read";
import createMessage from "@/web5/messages/create";
import { conversationSchema } from "@/lib/web5/schema";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Content } = Layout;
type ChatProps = {
  msg: string;
  time: string;
  isUser: boolean;
  id: string;
  adminName?: string;
};

export default function Support() {
  const [showChatBox, setShowChatBox] = useState(false);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [conversation, setConversation] = useState<Record[]>();
  const [chatsLoading, setChatsLoading] = useState(false);
  const [updatedChats, setUpdatedChats] = useState<ChatProps[]>();
  const [chats, setChats] = useState<ChatProps[]>();
  const [userDid, setUserDid] = useState<string>();
  const [pageLoading, setPageLoading] = useState(false);
  const [web5, setWeb5] = useState<Web5>();

  // initialize web5 and check if there is an ongoing conversation
  useEffect(() => {
    setPageLoading(true);
    const handleWeb5 = async () => {
      try {
        const { web5, userDID } = await initWeb5({
          password: sessionKey,
          sync: "5s",
        });
        setUserDid(userDID);
        setWeb5(web5);

        if (web5 && userDID) {
          await getMessages({ web5 }).then((res) => {
            if (res?.records && res?.records?.length > 0) {
              setConversation(res.records);
            }
            setPageLoading(false);
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    handleWeb5();
  }, []);

  useEffect(() => {
    async function getChatsFromDwn() {
      try {
        setChatsLoading(true);
        // fetch chats for the selected user
        if (showChatBox) {
          const response = await fetchChats();
          if (response) {
            setChats(response);
            setChatsLoading(false);
          }
        }
        setPageLoading(false);
        setShowChatBox(true);
      } catch (err) {
        console.log(err);
        setChatsLoading(false);
      }
    }

    conversation && getChatsFromDwn();
  }, [conversation]);

  useEffect(() => {
    const interval = setInterval(async () => {
      async function refreshChats() {
        try {
          const response = await fetchChats();
          if (response) {
            setUpdatedChats(response);
          }

          if (updatedChats?.length !== undefined) {
            if (updatedChats?.length > chats!.length) {
              setChats([...updatedChats]);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      conversation && (await refreshChats());
    }, 2500);

    return () => clearInterval(interval);
  }, [conversation, updatedChats, chats]);

  async function fetchChats() {
    try {
      const chats = await getChats({
        web5: web5!,
        parentId: conversation![0].id,
      });

      const details: {
        id: string;
        msg: string;
        time: string;
        isUser: boolean;
        adminName: string;
      }[] = [];

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
          adminName: "Support",
        };
        details.push(msgDetail);
      });
      return details;
    } catch (err) {
      console.log(err);
    }
  }

  //function to start a conversation
  async function initiateConversation(convoType: string) {
    try {
      const convo = {
        title: convoType,
        user: userDid,
      };
      const verifiedConvo = await conversationSchema.validateAsync(convo);
      const response = await createMessage({
        web5: web5!,
        message: verifiedConvo,
      });
      if (response?.record) {
        setConversation([response.record]);
        setShowChatBox(true);
        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleConvoType = async (type: string) => {
    await initiateConversation(type);
  };

  const confirmDeleteConversation: PopconfirmProps["onConfirm"] = async () => {
    try {
      if (!conversation) return;
      await conversation[0].delete({ prune: true });
      await conversation[0].send(conversation[0].author);
      setShowChatBox(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Content className='mt-8 mx-4 mb-4'>
      <Spin spinning={pageLoading} fullscreen />
      <h1 className='text-base font-bold mb-4'>Customer Support</h1>
      {!chatsLoading && !showChatBox && (
        <Intro handleConvoType={handleConvoType} />
      )}

      {chatsLoading && (
        <div className='my-16 mx-auto w-fit'>
          <Spin spinning={chatsLoading} />
        </div>
      )}
      {showChatBox && !chatsLoading && chats && (
        <div className='bg-white py-4 rounded-xl'>
          <Popconfirm
            title='Delete this conversation?'
            description='Are you sure to delete this convo?'
            onConfirm={confirmDeleteConversation}
            okText='Yes'
            cancelText='No'>
            <Button
              icon={<CloseCircleOutlined />}
              type='text'
              className='ml-3 mb-2'
              danger
              shape='circle'
            />
          </Popconfirm>
          <ChatBox
            isUser={true}
            parentId={conversation![0].id}
            web5={web5!}
            messages={chats}
          />
        </div>
      )}
    </Content>
  );
}
