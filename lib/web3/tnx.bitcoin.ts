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
      .get(`https://blockstream.info/testnet/api/address/${address}/utxo`)
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

    // `https://sendbitcoin-1.onrender.com/api/sendBtc`
    // `http://localhost:8000/api/sendBtc`
    const response = await axios.post(
      `https://sendbitcoin-1.onrender.com/api/sendBtc`,
      {
        data: encryptedData,
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

export { fetchBitcoinTnx, fetchBitcoinInfo, sendBitcoin };
