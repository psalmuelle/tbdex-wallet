"use client";

import type { RadioChangeEvent } from "antd";
import { Divider, Radio } from "antd";
import { useState } from "react";
import { useOfferingDetails } from "@/hooks/useSwap";
import { withTheme } from "@rjsf/core";
import { Theme as AntDTheme } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";

const Form = withTheme(AntDTheme);

export default function PaymentDetails() {
  const offering = useOfferingDetails((state) => state.offering);
  const [paymentChecked, setPaymentChecked] = useState({
    payin: false,
    payout: false,
  });
  const formatPaymentKind = (kind: string) => {
    if (kind) {
      return kind.replace(/_/g, " ");
    }
  };


  const onChange = (e: RadioChangeEvent) => {
    if (e.target.value === "payin") {
      setPaymentChecked((prev) => ({ ...prev, payin: true }));
    } else {
      setPaymentChecked((prev) => ({ ...prev, payout: true }));
    }
  };

  const onSubmit = ({formData}: any)=>{
    console.log('submitted', formData)
  }
  return (
    <section>
      <div className='mb-6'>
        <h2 className='font-medium'>Available Payin Methods</h2>
        <div className='mt-3'>
          <Radio onChange={onChange} value={"payin"}>
            {formatPaymentKind(offering?.data.payin.methods[0].kind!)}
          </Radio>
          {paymentChecked.payin && (
            <div className='w-full p-4 border rounded-lg mt-3'>
              <Form
                className='max-w-lg'
                schema={offering?.data.payin.methods[0].requiredPaymentDetails!}
                validator={validator}
                onSubmit={onSubmit}
              />
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
              <Form
                className='max-w-lg'
                schema={
                  offering?.data.payout.methods[0].requiredPaymentDetails!
                }
                validator={validator}
                onSubmit={onSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
