import type { Web5 } from "@web5/api";

type GetAddressProps = {
  web5: Web5;
};


export async function encryptAndStoreAddress(){
    
}


export async function getAddressFromDwn({
  web5,
}: GetAddressProps) {
  try {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: "BTCAddress",
          dataFormat: "application/json",
        },
      },
    });
    console.log(records)
    return records;
  } catch (error) {
    console.log(error);
  }
}
