import type { Web5 } from "@web5/api";
import protocolDefinition from "@/lib/web5/protocol";

interface CreateAdminRoleProps {
  web5: Web5;
  userDid: string;
}

export default async function createAdminRole({
  web5,
  userDid,
}: CreateAdminRoleProps) {
  try {
    const { record: postRecord, status: createStatus } =
      await web5.dwn.records.create({
        data: "isAdmin",
        message: {
          schema: protocolDefinition.types.admin.schema,
          dataFormat: "text/plain",
          protocol: protocolDefinition.protocol,
          protocolPath: "admin",
          recipient: userDid,
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
