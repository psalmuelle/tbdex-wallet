import type { Web5 } from "@web5/api";

interface GetKccProps {
  web5: Web5;
}

export default async function getKcc({ web5 }: GetKccProps) {
  const dwn = web5.dwn;
  const response = await dwn.records.query({
    message: {
      filter: {
        schema: "KnownCustomerCredential",
        dataFormat: "application/vc+jwt",
      },
    },
  });

  if (response.status.code === 200) {
    console.log("KCC retrieved sucessfully!");
    return response;
  }
}
