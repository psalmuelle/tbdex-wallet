import axios from "axios";
import { encryptData } from "../encrypt-info";

type BitcoinTnxTypes = {
  address: string;
};

async function fetchBitcoinTnx({ address }: BitcoinTnxTypes) {
  let data;
  try {
    await axios
      .get(`https://blockstream.info/testnet/api/address/${address}/txs`)
      .then((res) => {
        data = res.data;
      });
  } catch (err) {
    console.log(err);
  }
  return data;
}

async function fetchBitcoinInfo({ address }: BitcoinTnxTypes) {
  let data;
  try {
    await axios
      .get(`https://blockstream.info/testnet/api/address/${address}`)
      .then((res) => {
        data = res.data;
      });
  } catch (err) {
    console.log(err);
  }
  return data;
}

async function sendBitcoin({
  amountToSend,
  recieverAddress,
  payerAddress,
  privateKey,
}: {
  amountToSend: number;
  recieverAddress: string;
  payerAddress: string;
  privateKey: string;
}) {
  try {
    const data = {
      amountToSend: amountToSend,
      recieverAddress: recieverAddress,
      payerAddress: payerAddress,
      privateKey: privateKey,
    };
    const encryptedData = encryptData({ data });
console.log(encryptedData);
    axios
      .post(`http://localhost:8000/api/sendBtc`, {
        data: encryptedData,
      })
      .then((res) => {
        console.log(res);
      });
  } catch (err) {}
}

export { fetchBitcoinTnx, fetchBitcoinInfo, sendBitcoin };
