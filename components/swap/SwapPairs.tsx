import { SwapOutlined } from "@ant-design/icons";
import { Button, Divider, Form, InputNumber, Select } from "antd";
import type { FormProps } from "antd";
import { useSwapType, useSwapForm } from "@/hooks/useSwap";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export type SwapFormProps = {
  from: string;
  to: string;
  amount: string;
  swapType?: string;
};
type PairType = {
  _id: string;
  offering: string;
  type: string;
};

export default function SwapPairs({
  setNextStep,
}: {
  setNextStep: () => void;
}) {
  const [pairs, setPairs] = useState<PairType[]>([]);
  const activeSwapType: string = useSwapType((state) => state.swapType);
  const setSwapFormValues = useSwapForm((state) => state.setSwapForm);
  const [baseCurrency, setBaseCurrency] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const getFormValues = form.getFieldsValue();
    if (getFormValues.from === undefined) {
      return;
    } else {
      form.resetFields();
    }
  }, [activeSwapType]);

  //Fetching all pairs
  useEffect(() => {
    async function fetchCurrencies() {
      await axiosInstance.get("/api/pairs").then((res) => {
        setPairs(res.data.pairs);
      });
    }
    fetchCurrencies();
  }, []);

  const onFinish: FormProps<SwapFormProps>["onFinish"] = async (values) => {
    setSwapFormValues({
      from: values.from,
      to: values.to,
      amount: values.amount,
      swapType: activeSwapType,
    });
    setNextStep();
  };

  function handleSelectOptions(
    currency: string,
    type: string,
    baseCurrency?: string
  ) {
    let options: { label: string; value: string }[] = [];
    if (pairs !== undefined) {
      pairs.map((val) => {
        if (val.type === type) {
          if (currency === "base") {
            const baseOptions = {
              label: val.offering.split("/")[0],
              value: val.offering.split("/")[0],
            };
            return options.push(baseOptions);
          } else {
            if (val.offering.split("/")[0] == baseCurrency) {
              const quoteOptions = {
                label: val.offering.split("/")[1],
                value: val.offering.split("/")[1],
              };
              return options.push(quoteOptions);
            }
          }
        }
      });
    }
    const uniqueOptions = options.filter((option, index, self) => {
      return index === self.findIndex((o) => o.value === option.value);
    });
    return uniqueOptions;
  }

  return (
    <div>
      <section className='w-fit'>
        <Form
          form={form}
          autoComplete='off'
          name='swap-info'
          size='large'
          onFinish={onFinish}
          className='w-full mt-4 flex flex-col flex-wrap gap-2 border-2 p-6 rounded-xl bg-white'>
          <div>
            <p className='font-medium mb-2'>Exchange from</p>
            <Form.Item
              className='mb-0'
              name='amount'
              rules={[{ required: true, message: "" }]}>
              <InputNumber
                placeholder='Amount'
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
                      onChange={(e) => setBaseCurrency(e)}
                      key={activeSwapType === "off-ramp" ? "Token" : "Currency"}
                      placeholder={
                        activeSwapType === "off-ramp" ? "Token" : "Currency"
                      }
                      options={handleSelectOptions("base", activeSwapType)}
                    />
                  </Form.Item>
                }
              />
            </Form.Item>
          </div>
          <Divider style={{ borderColor: "#333", margin: "12px 0" }}>
            <SwapOutlined rotate={90} />
          </Divider>
          <div>
            <p className='font-medium mb-2'>to</p>
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
                    disabled={!baseCurrency}
                    options={handleSelectOptions(
                      "quote",
                      activeSwapType,
                      baseCurrency
                    )}
                  />
                </Form.Item>
              }
            />
          </div>
          <Button
            htmlType='submit'
            size='large'
            type='primary'
            className='w-full my-2'>
            Get Offerings
          </Button>
        </Form>
      </section>
    </div>
  );
}
