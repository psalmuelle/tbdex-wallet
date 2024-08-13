import CryptoJS from "crypto-js";

interface CryptoTypes {
  name: string;
  data?: unknown;
  password: string;
}

const encryptAndStoreData = ({ name, data, password }: CryptoTypes) => {
  const stringifiedData = JSON.stringify(data);

  const encryptedData = CryptoJS.AES.encrypt(
    stringifiedData,
    password
  ).toString();
  if (typeof window !== "undefined") {
    sessionStorage.setItem(name, encryptedData);
  }
};

const decryptAndRetrieveData = ({ name, password }: CryptoTypes) => {
  if (typeof window !== "undefined") {
    const encryptedData = sessionStorage.getItem(name);
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, password);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  }
};

export { encryptAndStoreData, decryptAndRetrieveData };
