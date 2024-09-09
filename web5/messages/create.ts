import type { Web5 } from "@web5/api";

interface CreateMessageProps {
  userDid: string;
  web5: Web5;
  message: {
    title: string;
    user: string;
  };
}

export default async function createMessage({
  web5,
  userDid,
  message,
}: CreateMessageProps) {
  try {
    const response = await web5.dwn.records.create({
      data: message,
      message: {
        schema: "https://wallet.chain.com/schemas/conversationSchema",
        protocol: "https://wallet.chain.com",
        protocolPath: "conversation",
        dataFormat: "application/json",
      },
    });

    if (response) {
      response.record?.send(userDid);
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}
