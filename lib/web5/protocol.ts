import type { DwnProtocolDefinition } from "@web5/agent";

const SupportProtocolDefinition: DwnProtocolDefinition = {
  protocol: "https://wallet.chain.com",
  published: true,
  types: {
    conversation: {
      schema: "https://wallet.chain.com/schemas/conversationSchema",
      dataFormats: ["application/json"],
    },
  },
  structure: {
    conversation: {
      $actions: [
        { who: "anyone", can: ["create"] },
        { who: "author", of: "conversation", can: ["read"] },
        { who: "recipient", of: "conversation", can: ["read"] },
      ],
    },
  },
};

export default SupportProtocolDefinition;
