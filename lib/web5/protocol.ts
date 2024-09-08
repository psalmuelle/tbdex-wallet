import type { DwnProtocolDefinition } from "@web5/agent";

const ProtocolDefinition: DwnProtocolDefinition = {
  protocol: "https://wallet.chain.com",
  published: true,
  types: {
    admin: {
      schema: "https://wallet.chain.com/schemas/admin",
      dataFormats: ["text/plain"],
    },
    conversation: {
      schema: "https://wallet.chain.com/schemas/conversationSchema",
      dataFormats: ["application/json"],
    },
    order: {
      schema: "https://wallet.chain.com/schemas/orderSchema",
      dataFormats: ["application/json"],
    },
    pair: {
      schema: "https://wallet.chain.com/schemas/pairSchema",
      dataFormats: ["application/json"],
    },
    pfi: {
      schema: "https://wallet.chain.com/schemas/pfiSchema",
      dataFormats: ["application/json"],
    },
  },
  structure: {
    admin: {
      $role: true,
    },
    conversation: {
      $actions: [
        { who: "anyone", can: ["create"] },
        { who: "author", of: "conversation", can: ["read", "update"] },
        { role: "admin", can: ["read", "update", "delete"] },
      ],
    },
    order: {
      $actions: [{ who: "anyone", can: ["create", "read"] }],
    },
    pair: {
      $actions: [
        { role: "admin", can: ["create", "read", "update", "delete"] },
        { who: "anyone", can: ["read"] },
      ],
    },
    pfi: {
      $actions: [
        { role: "admin", can: ["create", "read", "update", "delete"] },
        { who: "anyone", can: ["read", "update"] },
      ],
    },
  },
};

export default ProtocolDefinition;
