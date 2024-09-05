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
  try {
    await axios
      .get(`https://blockstream.info/testnet/api/address/${address}/txs`)
      .then((res) => {
        console.log(res.data);
      });
  } catch (err) {
    console.log(err);
  }
}

async function fetchBitcoinInfo({ address }: BitcoinTnxTypes) {
  try {
    await axios
      .get(`https://blockstream.info/testnet/api/address/${address}`)
      .then((res) => {
        console.log(res.data);
      });
  } catch (err) {
    console.log(err);
  }
}

export { fetchBitcoinTnx, fetchBitcoinInfo, sendBitcoin };
