import type { Web5 } from "@web5/api";
import protocolDefinition from "@/lib/web5/protocol";
import { pairSchema } from "@/lib/web5/schema";

interface CreatePairProps {
  web5: Web5;
  data: {
    _id: string;
    type: string;
    offering: string;
  };
}

export default async function createPair({ web5, data }: CreatePairProps) {
  try {
    const verifiedData = await pairSchema.validateAsync(data);

    const { record: postRecord, status: createStatus } =
      await web5.dwn.records.create({
        data: verifiedData,
        message: {
          schema: protocolDefinition.types.pair.schema,
          dataFormat: "application/json",
          protocol: protocolDefinition.protocol,
          protocolPath: "pair",
          published: true,
          protocolRole: "admin",
        },
      });

    if (postRecord) {
      const { status } = await postRecord.send();
      return status;
    }
  } catch (err) {
    console.log(err);
  }
}
