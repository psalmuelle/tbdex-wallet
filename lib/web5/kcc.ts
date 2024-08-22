import initWeb5 from "./web5";
import { Web5 } from "@web5/api";

type KCCTypes = {
    password?: string;
  };

export async function ManageKnownCustomerCredentials({ password }: KCCTypes) {
    const { web5, userDID } = await initWeb5({ password: password || "" });
    
   
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
        from: '',
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

  export async function sample(){
    const {web5, did:userDID} = await Web5.connect()
    console.log(userDID)
  }
  