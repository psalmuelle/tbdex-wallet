"use client";
import { useEffect, useState } from "react";
import { Button, Divider, Input, message, Modal, Spin, Typography } from "antd";
import { CreateBitcoinWallet, CreateMnemonic } from "@/lib/web3/wallet.bitcoin";
import { encryptData } from "@/lib/encrypt-info";
import type { Web5 } from "@web5/api";
import Image from "next/image";

type CreateBTCAccoutProps = {
  open: boolean;
  closeModal: () => void;
  web5: Web5;
};

export default function CreateBTCModal({
  open,
  web5,
  closeModal,
}: CreateBTCAccoutProps) {
  // 0 is create wallet, 1 is import wallet
  const [createType, setCreateType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState(0);
  const [passPhrase, setPassPhrase] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const [mnemonic, setMnemonic] = useState<string>("");

  const handleCreateMnemonic = async ({
    seedPhrase,
  }: {
    seedPhrase?: string;
  }) => {
    let passPhrase: any;
    try {
      if (seedPhrase && seedPhrase?.length > 0) {
        passPhrase = await CreateMnemonic({ mnemonicPhrase: seedPhrase });
      } else {
        passPhrase = await CreateMnemonic({});
      }
      setPassPhrase(passPhrase);
    } catch (err) {
      messageApi.error("Error importing wallet");
      throw new Error("An error occured while importing wallet");
    }
  };

  useEffect(() => {
    const createWallet = async () => {
      if (steps === 2) {
        setLoading(true);
        try {
          const wallet = await CreateBitcoinWallet({
            passPhrase: passPhrase,
            network: "testnet",
          });

          const selectedInfo = {
            xpub: wallet.xpub,
            address: wallet.address,
            privateKey: wallet.privateKey,
          };
          const stringifiedData = JSON.stringify(selectedInfo);
          const encryptedWallet = encryptData({ data: stringifiedData });
          const { record } = await web5.dwn.records.create({
            data: {
              wallet: encryptedWallet,
            },
            message: {
              schema: "BtcAddress",
              dataFormat: "application/json",
            },
          });
          await record?.send();
          setLoading(false);
        } catch (err) {
          messageApi.error("Error creating wallet");
          setLoading(false);
        }
      } else {
        return;
      }
    };

    createWallet();
  }, [steps]);
  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      title={"Create A BTC Wallet"}>
      <div className='my-8'>
        {steps === 0 && (
          <div>
            <Button
              onClick={() => {
                setCreateType(0);
                setSteps(1);
              }}
              type='primary'
              className='w-full'
              size='large'>
              Create New Wallet
            </Button>
            <Divider>or</Divider>
            <Button
              onClick={() => {
                setCreateType(1);
                setSteps(1);
              }}
              size='large'
              className='w-full'
              type='text'>
              Import Existing Wallet
            </Button>
          </div>
        )}

        {steps === 1 &&
          (createType === 0 ? (
            <div>
              <p className='mb-1'>
                {passPhrase && "Copy your Seed Phrase and store securely 🔒"}
              </p>
              <div className='min-h-[160px] bg-neutral-50 border rounded-xl'>
                {passPhrase && (
                  <Typography.Paragraph
                    copyable
                    className='h-40 p-4 text-wrap font-mono'>
                    {passPhrase.toString()}
                  </Typography.Paragraph>
                )}
              </div>
              {passPhrase ? (
                <Button
                  onClick={() => setSteps(2)}
                  type='primary'
                  className='w-full max-w-xs mx-auto mt-4 block'>
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={() => handleCreateMnemonic({})}
                  className='w-full max-w-xs mx-auto mt-4 block'>
                  Generate Your Seed Phrase
                </Button>
              )}
            </div>
          ) : (
            <div>
              <p className='mb-1'>Paste your Seed Phrase</p>
              <Input.TextArea
                placeholder='Enter 12-word Mnemonic'
                style={{ height: "160px", resize: "none" }}
                className='w-full bg-neutral-50 border rounded-xl'
                onChange={(e) => setMnemonic(e.target.value)}
              />

              <Button
                className='w-full max-w-xs mx-auto mt-4 block'
                onClick={() => {
                  handleCreateMnemonic({ seedPhrase: mnemonic })
                    .then(() => {
                      setSteps(2);
                    })
                    .catch(() => {});
                }}
                type='primary'>
                Continue
              </Button>
            </div>
          ))}

        {steps === 2 && (
          <div className='flex justify-center items-center'>
            <Spin className='my-24' spinning={loading} size='large' />
            {!loading && (
              <div className='w-full flex flex-col items-center justify-center gap-7'>
                <Image
                  src={"/3d-done.png"}
                  alt='success'
                  width={200}
                  height={200}
                />
                <Button
                  type='primary'
                  size='large'
                  onClick={() => closeModal()}
                  className='w-full max-w-sm'>
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {contextHolder}
    </Modal>
  );
}
