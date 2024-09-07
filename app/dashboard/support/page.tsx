"use client";
import Intro from "@/components/messages/Intro";
import { Layout } from "antd";
import ChatBox from "@/components/messages/ChatBox";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import type { Web5 } from "@web5/api";
import SupportProtocolDefinition from "@/lib/web5/protocol";
import type { DwnProtocolDefinition } from "@web5/agent";

const { Content } = Layout;
export default function Support() {
  const [showChat, setShowChat] = useState(false);
  const [convoType, setConvoType] = useState<number>();
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [userDid, setUserDid] = useState<string>();
  const [web5, setWeb5] = useState<Web5>();

  const handleConvoType = (type: number) => {
    setConvoType(type);
    setShowChat(true);
  };

  useEffect(() => {
    const handleWeb5 = async () => {
      const { web5, userDID } = await initWeb5({ password: sessionKey });
      setUserDid(userDID);
      setWeb5(web5);

      // Install protocol if absent
      if(web5 && userDID){
        await configureProtocol(web5, userDID);
      }
    };
  }, []);

  const queryForProtocol = async (web5: Web5) => {
    return await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: "https://wallet.chain.com/schemas/conversationSchema",
        },
      },
    });
  };

  const installProtocolLocally = async (
    web5: Web5,
    protocolDefinition: DwnProtocolDefinition
  ) => {
    return await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
  };

  const configureProtocol = async (web5: Web5, did: string) => {
    const protocolDefinition = SupportProtocolDefinition;

    const { protocols: localProtocol, status: localProtocolStatus } =
      await queryForProtocol(web5);
    if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
      const { protocol, status } = await installProtocolLocally(
        web5,
        protocolDefinition
      );
      console.log("Protocol installed locally", protocol, status);

      if (protocol) {
        await protocol.send(did);
      }
    } else {
      console.log("Protocol already installed");
    }
  };

  return (
    <Content className='mt-8 mx-4 mb-4'>
      <h1 className='text-base font-bold mb-4'>Customer Support</h1>
      {!showChat && <Intro handleConvoType={handleConvoType} />}
      {showChat && <ChatBox />}
    </Content>
  );
}
