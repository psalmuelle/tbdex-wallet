"use client";

import { useState, useEffect } from "react";
import type { RadioChangeEvent } from "antd";
import { Button, Divider, Radio, Spin } from "antd";
import { useOfferingDetails } from "@/hooks/useSwap";
import { withTheme } from "@rjsf/core";
import { Theme as AntDTheme } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import { CheckCircleFilled } from "@ant-design/icons";
import { Rfq, TbdexHttpClient } from "@tbdex/http-client";
import type { Web5 } from "@web5/api";
import { decryptAndRetrieveData, decryptData } from "@/lib/encrypt-info";
import { useSwapForm } from "@/hooks/useSwap";
import { PresentationExchange } from "@web5/credentials";
import initWeb5 from "@/web5/auth/access";
import { Web5PlatformAgent } from "@web5/agent";
import { getAddressFromDwn } from "@/lib/web3/getAddressFromDwn";

const Form = withTheme(AntDTheme);

interface PaymentDetailsProps {
  credentials: string[];
  setRfqId: (rfqId: string) => void;
  setNext: () => void;
}

export default function PaymentDetails({
  credentials,
  setRfqId,
  setNext,
}: PaymentDetailsProps) {
  const offering = useOfferingDetails((state) => state.offering);
  const [paymentChecked, setPaymentChecked] = useState({
    payin: false,
    payout: false,
  });
  const [paymentApproved, setPaymentApproved] = useState({
    payin: false,
    payout: false,
  });
  const [paymentDetails, setPaymentDetails] = useState({
    payin: {},
    payout: {},
  });
  const [formComplete, setFormComplete] = useState(false);
  const [web5, setWeb5] = useState<Web5>();
  const userDID: string = decryptAndRetrieveData({ name: "userDID" });
  const swapForm = useSwapForm((state) => state.swapForm);

  useEffect(() => {
    async function initialize() {
      const { web5 } = await initWeb5({
        password: decryptAndRetrieveData({ name: "sessionKey" }),
      });
      setWeb5(web5);
    }
    initialize();
  }, []);

  useEffect(() => {
    //Select credentials based on the presentation definition
    const selectedCredentials = PresentationExchange.selectCredentials({
      vcJwts: credentials,
      presentationDefinition: offering?.data.requiredClaims!,
    });

    async function createRfq() {
      //Create an RFQ
      const rfq = Rfq.create({
        metadata: {
          from: userDID,
          to: offering?.metadata.from!,
          protocol: offering?.metadata.protocol,
        },
        data: {
          offeringId: offering?.id!,
          payin: {
            kind: offering?.data.payin.methods[0].kind!,
            amount: swapForm.amount.toString(),
            paymentDetails: paymentDetails.payin,
          },
          payout: {
            kind: offering?.data.payout.methods[0].kind!,
            paymentDetails: paymentDetails.payout,
          },
          claims: selectedCredentials,
        },
      });

      //Verify the offering requirements
      try {
        await rfq.verifyOfferingRequirements(offering!);
      } catch (error) {
        console.log(error);
      }

      //Sign RFQ
      if (web5) {
        const agent = web5.agent as Web5PlatformAgent;
        const identities = await agent.identity.list();
        await rfq.sign(identities[0].did);

        //Create an Exchange and redirect to next step
        try {
          await TbdexHttpClient.createExchange(rfq);

          // Save Offering Details to DWN
          const { record } = await web5.dwn.records.create({
            data: {
              exchangeId: rfq.id,
              pfiDID: offering?.metadata.from,
            },
            message: {
              schema: "UserExchange",
              dataFormat: "application/json",
            },
          });
          await record?.send(userDID);
          setRfqId(rfq.id);
          setNext();
        } catch (err) {
          console.log("Failed to create exchange:", err);
        }
      } else {
        console.log("Failed to initialize web5");
      }
    }

    //Triggers if all Payment details have been filled
    if (paymentApproved.payin && paymentApproved.payout) {
      setFormComplete(true);
      createRfq();
    }
  }, [paymentApproved]);

  const onChange = (e: RadioChangeEvent) => {
    if (e.target.value === "payin") {
      setPaymentChecked((prev) => ({ ...prev, payin: true }));
    } else {
      setPaymentChecked((prev) => ({ ...prev, payout: true }));
    }
  };

  //Handle Payin Submit
  const handlePayinSubmit = ({ formData }: any) => {
    setPaymentApproved((prev) => ({ ...prev, payin: true }));
    setPaymentDetails((prev) => ({ ...prev, payin: formData }));
  };

  //Handle Payout Submit
  const handlePayoutSubmit = ({ formData }: any) => {
    setPaymentApproved((prev) => ({ ...prev, payout: true }));
    setPaymentDetails((prev) => ({ ...prev, payout: formData }));
  };

  //Format Payment kind by removing the _ and replacing it with a space
  const formatPaymentKind = (kind: string) => {
    if (kind) {
      return kind.replace(/_/g, " ");
    }
  };

  // Handle Swap to wallet address
  const handleSwapToWallet = async () => {
    // Swap to wallet address
    await getAddressFromDwn({ web5: web5! }).then(async (records) => {
      const data = await records![0].data.json();
      const decryptWalletInfo = decryptData({ data: data.wallet });
      const parsedWalletInfo = JSON.parse(decryptWalletInfo);
      setPaymentApproved((prev) => ({ ...prev, payout: true }));
      setPaymentDetails((prev) => ({
        ...prev,
        payout: { address: parsedWalletInfo.address },
      }));
    });
  };
  return (
    <section>
      <Spin spinning={formComplete}>
        <div className='mb-6'>
          <h2 className='font-medium'>Available Payin Methods</h2>
          <div className='mt-3'>
            <Radio onChange={onChange} value={"payin"}>
              {formatPaymentKind(offering?.data.payin.methods[0].kind!)}
            </Radio>
            {paymentChecked.payin && (
              <div className='w-full p-4 border rounded-lg mt-3'>
                {paymentApproved.payin ? (
                  <div className='my-4 mx-auto w-fit'>
                    <CheckCircleFilled
                      style={{ color: "green" }}
                      className='text-5xl font-bold'
                    />
                  </div>
                ) : (
                  <Form
                    children={
                      <Button htmlType='submit' type='primary'>
                        Submit
                      </Button>
                    }
                    className='max-w-md'
                    schema={
                      offering?.data.payin.methods[0].requiredPaymentDetails!
                    }
                    validator={validator}
                    onSubmit={handlePayinSubmit}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <Divider />
        <div>
          <h2 className='font-medium'>Available Payout Methods</h2>
          <div className='mt-4'>
            <Radio onChange={onChange} value={"payout"}>
              {formatPaymentKind(offering?.data.payout.methods[0].kind!)}
            </Radio>
            {paymentChecked.payout && (
              <div className='w-full p-4 border rounded-lg mt-3'>
                {paymentApproved.payout ? (
                  <div className='my-4 mx-auto w-fit'>
                    <CheckCircleFilled
                      style={{ color: "green" }}
                      className='text-5xl font-bold'
                    />
                  </div>
                ) : (
                  <>
                    {offering?.data.payout.currencyCode === "BTC" && (
                      <Button
                        onClick={handleSwapToWallet}
                        type='primary'
                        className='mb-4 w-full'>
                        Swap to your wallet address
                      </Button>
                    )}
                    <Form
                      children={
                        <Button htmlType='submit' type='primary'>
                          Submit
                        </Button>
                      }
                      className='max-w-md'
                      schema={
                        offering?.data.payout.methods[0].requiredPaymentDetails!
                      }
                      validator={validator}
                      onSubmit={handlePayoutSubmit}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Spin>
    </section>
  );
}
