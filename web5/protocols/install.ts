import type { Web5 } from "@web5/api";
import type { DwnProtocolDefinition } from "@web5/agent";
import protocolDefinition from "@/lib/web5/protocol";

const queryForProtocol = async (web5: Web5) => {
  return await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: "https://wallet.chain.com",
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
  const { protocols: localProtocol, status: localProtocolStatus } =
    await queryForProtocol(web5);
  if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
    const { protocol, status } = await installProtocolLocally(
      web5,
      protocolDefinition
    );
    console.log("Protocol installed locally", protocol, status);

    if (protocol) {
     return await protocol.send(did);
    }
  } else {
    console.log("Protocol already installed");
  }
};

export default configureProtocol;
