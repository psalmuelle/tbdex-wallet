import type { Web5 } from "@web5/api";

interface GetMessagesProps {
  web5: Web5;
  isAdmin: boolean;
}

export default async function getMessages({
  web5,
  isAdmin,
}: GetMessagesProps) {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          schema: "https://wallet.chain.com/schemas/conversationSchema",
          protocol: "https://wallet.chain.com",
          protocolPath: "conversation",
          dataFormat: "application/json",
        },
        protocolRole: isAdmin ? "admin" : undefined,
      },
    });

    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}
