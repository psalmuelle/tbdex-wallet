import type { DwnProtocolDefinition } from "@web5/agent";

const protocolDefinition: DwnProtocolDefinition = {
  protocol: "https://wallet.chain.com",
  published: true,
  types: {
    conversation: {
      schema: "https://wallet.chain.com/schemas/conversationSchema",
      dataFormats: ["application/json"],
    },
    message: {
      schema: "https://wallet.chain.com/schemas/messageSchema",
      dataFormats: ["application/json"],
    },
  },
  structure: {
    conversation: {
      $actions: [
        { who: "anyone", can: ["create"] },
        {
          who: "author",
          of: "conversation",
          can: ["create", "read", "update"],
        },
        {
          who: "recipient",
          of: "conversation",
          can: ["create", "read", "update", "delete"],
        },
      ],
      message: {
        $actions: [
          { who: "author", of: "conversation", can: ["create", "read"] },
          {
            who: "recipient",
            of: "conversation",
            can: ["create", "read"],
          },
        ],
      },
    },
  },
};

export default protocolDefinition;
