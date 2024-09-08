import initWeb5 from "@/web5/auth/access";

type KCCTypes = {
  password: string;
  vcJwt?: string;
};

export async function ManageKnownCustomerCredentials({
  password,
  vcJwt,
}: KCCTypes) {
  const { web5, userDID } = await initWeb5({ password: password });

  //Save KCC into dwn
  const save = async () => {
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
    const response = await record.send(userDID);
    if (response.status.code === 202) {
      console.log("KCC saved sucessfully!");

      return { record };
    }
  };

  //Retrieve KCC from dwn
  const get = async () => {
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
  };

  return {
    save,
    get,
  };
}
