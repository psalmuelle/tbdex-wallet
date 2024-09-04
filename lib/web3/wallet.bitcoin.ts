import Mnemonic from "bitcore-mnemonic";

type CreateWalletProps = {
  network: string;
  passPhrase: any;
};
type CreateMnemonicProps = {
  mnemonicPhrase?: string;
};

//Create Mnemonic
async function CreateMnemonic({ mnemonicPhrase }: CreateMnemonicProps) {
  let passPhrase: any;

  if (mnemonicPhrase) {
    passPhrase = await new Mnemonic(mnemonicPhrase);
  } else {
    passPhrase = await new Mnemonic(Mnemonic.Words.ENGLISH);
  }
  return passPhrase;
}

//Create Wallet
async function CreateBitcoinWallet({
  network = "testnet",
  passPhrase,
}: CreateWalletProps) {
  const xpriv = await passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  return {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString(),
  };
}

export { CreateMnemonic, CreateBitcoinWallet };
