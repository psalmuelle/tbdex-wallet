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
  receiverAddress,
  payerAddress,
  privateKey,
}: {
  amountToSend: number;
  receiverAddress: string;
  payerAddress: string;
  privateKey: string;
}) {
  try {
    const data = {
      amountToSend: amountToSend,
      receiverAddress: receiverAddress,
      payerAddress: payerAddress,
      privateKey: privateKey,
    };
    const encryptedData = encryptData({ data });

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
