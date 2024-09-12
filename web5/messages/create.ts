import type { Web5 } from "@web5/api";

interface CreateMessageProps {
  web5: Web5;
  message: {
    title: string;
    user: string;
  };
}

export default async function createMessage({
  web5,
  message,
}: CreateMessageProps) {
  const adminDid = process.env.NEXT_PUBLIC_ADMIN_DID as string;
  try {
    const response = await web5.dwn.records.create({
      data: message,
      message: {
        schema: "https://wallet.chain.com/schemas/conversationSchema",
        protocol: "https://wallet.chain.com",
        protocolPath: "conversation",
        dataFormat: "application/json",
        recipient: adminDid,
      },
    });

    if (response) {
      await response.record?.send(adminDid);
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createChat({
  web5,
  chat,
  parentId,
  receiverDid,
}: {
  web5: Web5;
  parentId: string;
  receiverDid?: string;
  chat: {
    msg: string;
    createdAt: string;
  };
}) {
  const adminDid = process.env.NEXT_PUBLIC_ADMIN_DID as string;
  const receivingParty = receiverDid ? receiverDid : adminDid;
  try {
    const response = await web5.dwn.records.create({
      data: chat,
      message: {
        schema: "https://wallet.chain.com/schemas/messageSchema",
        protocol: "https://wallet.chain.com",
        protocolPath: "conversation/message",
        dataFormat: "application/json",
        recipient: receivingParty,
        parentContextId: parentId,
      },
    });

    if (response) {
      await response.record?.send(receivingParty);
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}
