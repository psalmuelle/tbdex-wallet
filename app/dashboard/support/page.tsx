"use client";
import Intro from "@/components/messages/Intro";
import { Layout, Spin } from "antd";
import ChatBox from "@/components/messages/ChatBox";
import { useEffect, useState } from "react";
import initWeb5 from "@/web5/auth/access";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import type { Web5, Record } from "@web5/api";
import getMessages from "@/web5/messages/read";
import createMessage from "@/web5/messages/create";
import { conversationSchema, messageSchema } from "@/lib/web5/schema";

const { Content } = Layout;

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

export default function Support() {
  const [showChat, setShowChat] = useState(false);
  const [convoOngoing, setConvoOngoing] = useState<boolean>(false);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [conversation, setConversation] = useState<Record[]>();
  const [userDid, setUserDid] = useState<string>();
  const [pageLoading, setPageLoading] = useState(false);
  const [web5, setWeb5] = useState<Web5>();

  // initialize web5 and check if there is an ongoing conversation
  useEffect(() => {
    setPageLoading(true);
    const handleWeb5 = async () => {
      try {
        const { web5, userDID } = await initWeb5({ password: sessionKey });
        setUserDid(userDID);
        setWeb5(web5);

        if (web5 && userDID) {
          await getMessages({ web5 }).then((res) => {
            if (res?.records && res?.records?.length > 0) {
              setConvoOngoing(true);
              setConversation(res.records);
            }
          });
        }
        setPageLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    handleWeb5();
  }, []);

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
        console.log(response);
        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleConvoType = async (type: string) => {
    await initiateConversation(type);
    setShowChat(true);
  };

  return (
    <Content className='mt-8 mx-4 mb-4'>
      <Spin spinning={pageLoading} fullscreen />
      <h1 className='text-base font-bold mb-4'>Customer Support</h1>
      {!convoOngoing && !showChat && (
        <Intro handleConvoType={handleConvoType} />
      )}
      {(showChat || convoOngoing) && (
        <ChatBox isUser={true} parentId={conversation![0].id} web5={web5!} messages={test} />
      )}
    </Content>
  );
}
