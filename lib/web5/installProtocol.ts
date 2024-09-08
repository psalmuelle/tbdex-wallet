import type { Web5 } from "@web5/api";
import SupportProtocolDefinition from "./protocol";
import type { DwnProtocolDefinition } from "@web5/agent";

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

export default configureProtocol;
