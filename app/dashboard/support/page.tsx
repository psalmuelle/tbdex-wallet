"use client";
import Intro from "@/components/messages/Intro";
import { Layout, Spin } from "antd";
import ChatBox from "@/components/messages/ChatBox";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import type { Web5 } from "@web5/api";

const { Content } = Layout;
export default function Support() {
  const [showChat, setShowChat] = useState(false);
  const [convoType, setConvoType] = useState<number>();
  const [convoOngoing, setConvoOngoing] = useState<boolean>(false);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [userDid, setUserDid] = useState<string>();
  const [pageLoading, setPageLoading] = useState(false);
  const [web5, setWeb5] = useState<Web5>();

  const handleConvoType = (type: number) => {
    setConvoType(type);
    setShowChat(true);
  };

  useEffect(() => {
    setPageLoading(true);
    const handleWeb5 = async () => {
      const { web5, userDID } = await initWeb5({ password: sessionKey });
      setUserDid(userDID);
      setWeb5(web5);

      // Install protocol if absent
      if (web5 && userDID) {
        const { protocols } = await web5.dwn.protocols.query({
          message: {
            filter: {
              protocol: "https://wallet.chain.com",
            },
          },
        });
        console.log('Protocols', protocols)
        await fetchConversation(web5);
      }
      setPageLoading(false);
    };
    handleWeb5();
  }, []);

  const fetchConversation = async (web5: Web5) => {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: "https://wallet.chain.com",
          protocolPath: 'conversation',
        },
      },
    });

    if (response.status.code === 200) {
      if (response.records && response.records?.length > 0) {
        setConvoOngoing(true);
      }
    }
  };

  return (
    <Content className='mt-8 mx-4 mb-4'>
      <Spin spinning={pageLoading} fullscreen />
      <h1 className='text-base font-bold mb-4'>Customer Support</h1>
      {!convoOngoing && !showChat && (
        <Intro handleConvoType={handleConvoType} />
      )}
      {(showChat || convoOngoing) && <ChatBox />}
    </Content>
  );
}
