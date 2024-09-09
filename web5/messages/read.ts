import type { Web5 } from "@web5/api";

interface GetMessagesProps {
  web5: Web5;
}

export default async function getMessages({ web5 }: GetMessagesProps) {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          schema: "https://wallet.chain.com/schemas/conversationSchema",
          protocol: "https://wallet.chain.com",
          protocolPath: "conversation",
          dataFormat: "application/json",
          recipient:
            "did:dht:j7ouj9uxza59k9o7m9fh4b4d5n9ukdnjfyofgyhz9zbrqaofwhky",
        },
      },
    });

    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}
