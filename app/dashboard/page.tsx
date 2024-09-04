"use client";

import { Layout } from "antd";
import { CreateBitcoinWallet, CreateMnemonic } from "@/lib/web3/wallet.bitcoin";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import type { Web5 } from "@web5/api";
import CreateBTCModal from "@/components/dashboard/CreateBTCAcct";

const { Content } = Layout;

export default function Dashboard() {
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [web5, setWeb5] = useState<Web5>();
  const [accountLoading, setAccountLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function connectToWeb5() {
      const { web5 } = await initWeb5({ password: sessionKey });
      setWeb5(web5);
    }
    connectToWeb5();
  }, []);

  useEffect(() => {
    const createWallet = async () => {
      const passPhrase = await CreateMnemonic({});
      const wallet = await CreateBitcoinWallet({
        network: "testnet",
        passPhrase: passPhrase,
      });
      console.log(wallet);
      console.log(passPhrase);
    };

    const fetchWalletFromDwn = async () => {};
    createWallet();
  });
  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Dashboard</h1>

      <div>
        <h2>Decentralized Accounts</h2>
        <div></div>
      </div>
      <CreateBTCModal
        open={open}
        openModal={() => setOpen(true)}
        closeModal={() => setOpen(false)}
      />
    </Content>
  );
}
