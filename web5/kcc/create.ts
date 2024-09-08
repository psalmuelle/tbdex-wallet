import type { Web5 } from "@web5/api";

interface CreateKccProps {
  web5: Web5;
  vcJwt: string;
  userDid: string;
}

export default async function createKcc({
  web5,
  vcJwt,
  userDid,
}: CreateKccProps) {
  if (!vcJwt) return;

  const { record } = await web5.dwn.records.create({
    data: vcJwt,
    message: {
      schema: "KnownCustomerCredential",
      dataFormat: "application/vc+jwt",
    },
  });

  if (record === undefined) {
    console.log("Failed to save KCC");
    return;
  }
  const response = await record.send(userDid);

  if (response.status.code === 202) {
    console.log("KCC saved successfully");
    return { record };
  }
}
