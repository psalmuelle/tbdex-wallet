import type { Web5 } from "@web5/api";
import type { Web5PlatformAgent } from "@web5/agent";

type GetAddressProps = {
  web5: Web5;
};

export async function getAddressFromDwn({ web5 }: GetAddressProps) {
  try {
    const userAgent = web5.agent as Web5PlatformAgent;
    const identities = await userAgent.identity.list();
    const { records } = await web5.dwn.records.query({
      from: identities[0].did.uri,
      message: {
        filter: {
          schema: "BtcAddress",
          dataFormat: "application/json",
        },
      },
    });
    return records;
  } catch (error) {
    console.log(error);
  }
}
