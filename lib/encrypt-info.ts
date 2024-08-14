import CryptoJS from "crypto-js";

interface CryptoTypes {
  name: string;
  data?: unknown;
}

const encryptAndStoreData = ({ name, data }: CryptoTypes) => {
  const password = process.env.NEXT_PUBLIC_ENCRYPTION_PASSWORD as string;
  const stringifiedData = JSON.stringify(data);

  const encryptedData = CryptoJS.AES.encrypt(
    stringifiedData,
    password
  ).toString();
  if (typeof window !== "undefined") {
    sessionStorage.setItem(name, encryptedData);
  }
};

const decryptAndRetrieveData = ({ name }: CryptoTypes) => {
  const password = process.env.NEXT_PUBLIC_ENCRYPTION_PASSWORD as string;
  if (typeof window !== "undefined") {
    const encryptedData = sessionStorage.getItem(name);
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, password);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  }
};

export { encryptAndStoreData, decryptAndRetrieveData };
