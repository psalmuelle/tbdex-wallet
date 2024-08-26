import initWeb5 from "./web5";

type KCCTypes = {
    password: string;
    vcJwt?: string;
  };

export async function ManageKnownCustomerCredentials({ password, vcJwt }: KCCTypes) {
    const { web5, userDID } = await initWeb5({ password: password });
    
   
    //Save KCC into dwn
    const save = async () => {
      if(!vcJwt) return;

      const { record, status } = await web5.dwn.records.create({
        data: vcJwt,
        message: {
          schema: "KnownCustomerCredential",
          dataFormat: "application/vc+jwt",
        },
      });

      if (status.code === 202) {
        console.log("KCC saved sucessfully!");
        return { record, status };
      }
    };
  
    //Retrieve KCC from dwn
    const get = async () => {
      const dwn = web5.dwn;
      const response = await dwn.records.query({
        from: userDID,
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
  
