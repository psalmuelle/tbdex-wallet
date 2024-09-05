import axios from "axios";

type BitcoinTnxTypes = {
  address: string;
};

async function sendBitcoin() {
  try {
  } catch (err) {
    console.log(err);
  }
}

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

export { fetchBitcoinTnx, fetchBitcoinInfo, sendBitcoin };
