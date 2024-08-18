import { SwapOutlined } from "@ant-design/icons";
import { Button, Divider, Form, InputNumber, Select } from "antd";
import type { FormProps } from "antd";
import { useSwapType } from "@/hooks/useSwap";
import { useEffect, useState } from "react";

const currencies = [
  {
    label: "AUD",
    value: "AUD",
  },
  {
    label: "EUR",
    value: "EUR",
  },
  {
    label: "GBP",
    value: "GBP",
  },
  {
    label: "GHS",
    value: "GHS",
  },
  {
    label: "KES",
    value: "KES",
  },
  {
    label: "MXN",
    value: "MXN",
  },
  {
    label: "NGN",
    value: "NGN",
  },
  {
    label: "USD",
    value: "USD",
  },
];

const tokens = [
  {
    label: "BTC",
    value: "BTC",
  },
  {
    label: "USDC",
    value: "USDC",
  },
];

type SwapFormProps = {
  from: string;
  to: string;
  amount: string;
};

export default function SwapPairs() {
  const swapType = {
    "0": "on-ramp",
    "1": "off-ramp",
    "2": "forex",
  };
  const activeSwapType: string = useSwapType((state) => state.swapType);
  const [form] = Form.useForm();
  const swapMethod = Object.entries(swapType).find(
    (key) => key[0] === activeSwapType
  );

  useEffect(() => {
    const getFormValues = form.getFieldsValue();
    if (getFormValues.from === undefined) {
      return;
    } else {
      form.resetFields();
    }
  }, [swapMethod?.[1]]);

  const onFinish: FormProps<SwapFormProps>["onFinish"] = async (values) => {
    const swapInfo = {
      from: values.from,
      to: values.to,
      amount: values.amount,
      swapType: swapMethod?.[1],
    };
    console.log(swapInfo);
  };

  return (
    <section className='w-fit'>
      <Form
        form={form}
        autoComplete='off'
        name='swap-info'
        size='large'
        onFinish={onFinish}
        className='w-full mt-6 flex flex-col flex-wrap gap-2 border-2 p-6 rounded-xl bg-white'>
        <div>
          <p className='font-medium mb-3'>Exchange from</p>
          <Form.Item
            className='mb-0'
            name='amount'
            rules={[{ required: true, message: "" }]}>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
              addonBefore={
                <Form.Item
                  className='mb-0 w-28 -mx-[11px]'
                  name='from'
                  rules={[{ required: true, message: "" }]}>
                  <Select
                    key={swapMethod?.[1] === "off-ramp" ? "Token" : "Currency"}
                    placeholder={
                      swapMethod?.[1] === "off-ramp" ? "Token" : "Currency"
                    }
                    options={
                      swapMethod?.[1] === "off-ramp" ? tokens : currencies
                    }
                  />
                </Form.Item>
              }
            />
          </Form.Item>
        </div>
        <Divider style={{ borderColor: "#333" }}>
          <SwapOutlined rotate={90} />
        </Divider>
        <div>
          <p className='font-medium mb-3'>Exchange to</p>
          <InputNumber
            disabled
            addonBefore={
              <Form.Item
                className='mb-0 w-28 -mx-[11px]'
                name={"to"}
                rules={[{ required: true, message: "" }]}>
                <Select
                  key={swapMethod?.[1] === "on-ramp" ? "Token" : "Currency"}
                  placeholder={
                    swapMethod?.[1] === "on-ramp" ? "Token" : "Currency"
                  }
                  options={swapMethod?.[1] === "on-ramp" ? tokens : currencies}
                />
              </Form.Item>
            }
          />
        </div>
        <Button
          htmlType='submit'
          size='large'
          type='primary'
          className='w-full my-4'>
          Submit
        </Button>
      </Form>
    </section>
  );
}
