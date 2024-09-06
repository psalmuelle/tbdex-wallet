import type { Web5 } from "@web5/api";
import type { Web5PlatformAgent } from "@web5/agent";

type GetAddressProps = {
  web5: Web5;
};

export async function getAddressFromDwn({ web5 }: GetAddressProps) {
  try {
    const { records } = await web5.dwn.records.query({
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
