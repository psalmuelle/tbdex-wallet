import { Web5 } from "@web5/api";
import { VerifiableCredential, PresentationExchange } from "@web5/credentials";

type initWebTypes = {
  password: string;
};
type KCCTypes = {
  password: string;
};

export default async function initWeb5({ password }: initWebTypes) {
  const { web5, did: userDID } = await Web5.connect({
    password: password,
  });
  return {
    web5,
    userDID,
  };
}

export async function ManageKnownCustomerCredentials({ password }: KCCTypes) {
  const { web5, userDID } = await initWeb5({ password: password });

  //Save KCC into dwn
  const save = async (vcJwt: string) => {
    const dwn = web5.dwn;
    const { record, status } = await dwn.records.create({
      data: vcJwt,
      message: {
        schema: "KnownCustomerCredential",
        dataFormat: "application/vc+jwt",
      },
    });
    if (status.code === 200) {
      console.log("KCC saved sucessfully!");
      return { record, status };
    }
  };

  //Retrieve KCC from dwn
  const get = async () => {
    const dwn = web5.dwn;
    const { records, status } = await dwn.records.query({
      from: userDID,
      message: {
        filter: {
          schema: "KnownCustomerCredential",
          dataFormat: "application/vc+jwt",
        },
      },
    });
    if (status.code === 200) {
      console.log("KCC retrieved sucessfully!");
      return { records, status };
    }
  };

  return {
    save,
    get,
  };
}

export function KnownCustomerCredential() {}
