import { SwapOutlined } from "@ant-design/icons";
import { Button, Divider, Form, InputNumber, Select } from "antd";
import type { FormProps } from "antd";
import { useSwapType } from "@/hooks/useSwap";
import { useEffect, useState } from "react";
import Offerings from "./Offerings";

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

export type SwapFormProps = {
  from: string;
  to: string;
  amount: string;
  swapType?: string;
};

export default function SwapPairs() {

  const [swapInfo, setSwapInfo] = useState<SwapFormProps>();
  const activeSwapType: string = useSwapType((state) => state.swapType);
  const [form] = Form.useForm();


  useEffect(() => {
    const getFormValues = form.getFieldsValue();
    if (getFormValues.from === undefined) {
      return;
    } else {
      form.resetFields();
    }
  }, [activeSwapType]);
  useEffect(()=>{

   function fetchCurrencies(){

   }
  },[])

  const onFinish: FormProps<SwapFormProps>["onFinish"] = async (values) => {
    setSwapInfo({
      amount: values.amount,
      to: values.to,
      from: values.from,
      swapType: activeSwapType,
    });
    form.resetFields();
  };

  return (
    <div>
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
              placeholder="Amount"
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
                      key={
                        activeSwapType === "off-ramp" ? "Token" : "Currency"
                      }
                      placeholder={
                        activeSwapType === "off-ramp" ? "Token" : "Currency"
                      }
                      options={
                        activeSwapType === "off-ramp" ? tokens : currencies
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
                    key={activeSwapType === "on-ramp" ? "Token" : "Currency"}
                    placeholder={
                      activeSwapType === "on-ramp" ? "Token" : "Currency"
                    }
                    options={
                      activeSwapType === "on-ramp" ? tokens : currencies
                    }
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
            Get Offerings
          </Button>
        </Form>
      </section>
      <Offerings
        swapType={swapInfo?.swapType}
        to={swapInfo?.to!}
        from={swapInfo?.from!}
        amount={swapInfo?.amount!}
      />
    </div>
  );
}
