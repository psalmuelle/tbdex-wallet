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
        published: true,
      },
    });

    if (response) {
      response.record?.send(adminDid);
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}
