import CryptoJS from "crypto-js";

interface CryptoTypes {
  name?: string;
  data?: unknown;
}

const encryptData = ({ data }: CryptoTypes) => {
  const password = process.env.NEXT_PUBLIC_ENCRYPTION_PASSWORD as string;
  const stringifyData = JSON.stringify(data);

  const encrypt = CryptoJS.AES.encrypt(stringifyData, password).toString();
  return encrypt;
};

const decryptData = ({ data }: CryptoTypes) => {
  const password = process.env.NEXT_PUBLIC_ENCRYPTION_PASSWORD as string;
  const bytes = CryptoJS.AES.decrypt(data as string, password);

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const encryptAndStoreData = ({ name, data }: CryptoTypes) => {
  const password = process.env.NEXT_PUBLIC_ENCRYPTION_PASSWORD as string;
  const stringifiedData = JSON.stringify(data);

  const encryptedData = CryptoJS.AES.encrypt(
    stringifiedData,
    password
  ).toString();
  if (typeof window !== "undefined") {
    sessionStorage.setItem(name!, encryptedData);
  }
};

const decryptAndRetrieveData = ({ name }: CryptoTypes) => {
  const password = process.env.NEXT_PUBLIC_ENCRYPTION_PASSWORD as string;
  if (typeof window !== "undefined") {
    const encryptedData = sessionStorage.getItem(name!);
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, password);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  }
};

export {
  encryptAndStoreData,
  decryptAndRetrieveData,
  encryptData,
  decryptData,
};
