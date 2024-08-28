"use client";

import { useState, useEffect } from "react";
import type { RadioChangeEvent } from "antd";
import { Divider, Radio, Spin } from "antd";
import { useOfferingDetails } from "@/hooks/useSwap";
import { withTheme } from "@rjsf/core";
import { Theme as AntDTheme } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import { CheckCircleFilled } from "@ant-design/icons";
import { Rfq } from "@tbdex/http-client";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import { useSwapForm } from "@/hooks/useSwap";
import { PresentationExchange } from "@web5/credentials";
import { BearerDid, DidDht } from "@web5/dids";

const Form = withTheme(AntDTheme);

interface PaymentDetailsProps {
  credentials: string[];
}

export default function PaymentDetails({ credentials }: PaymentDetailsProps) {
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
  const userDID = decryptAndRetrieveData({ name: "userDID" });
  const swapForm = useSwapForm((state) => state.swapForm);

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
        await rfq.verifyOfferingRequirements(offering!)
      } catch (error) {
        console.log(error);
      }

      //Sign RFQ
      
 
      

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
                  <Form
                    className='max-w-md'
                    schema={
                      offering?.data.payout.methods[0].requiredPaymentDetails!
                    }
                    validator={validator}
                    onSubmit={handlePayoutSubmit}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Spin>
    </section>
  );
}
