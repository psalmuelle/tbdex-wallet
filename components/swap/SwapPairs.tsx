import { SwapOutlined } from "@ant-design/icons";
import { Divider, InputNumber, Select } from "antd";
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

export default function SwapPairs() {
  const activeSwapType: string = useSwapType((state) => state.swapType);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const swapType = {
    "0": "on-ramp",
    "1": "off-ramp",
    "2": "forex",
  };
  const swapMethod = Object.entries(swapType).find(
    (key) => key[0] === activeSwapType
  );
 useEffect(()=>{
   
   console.log(selectedFrom, selectedTo);
 })


  return (
    <section className='w-fit mt-6 flex flex-col flex-wrap gap-2 border-2 p-6 rounded-xl bg-white'>
      <div>
        <p className='font-medium mb-3'>Exchange from</p>
        <InputNumber
          key={swapMethod?.[1] === "off-ramp" ? "Token" : "Currency"}
          size='large'
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) =>
            value?.replace(/\$\s?|(,*)/g, "") as unknown as number
          }
          addonBefore={
            <Select
              key={swapMethod?.[1] === "off-ramp" ? "Token" : "Currency"}
              placeholder={
                swapMethod?.[1] === "off-ramp" ? "Token" : "Currency"
              }
              options={swapMethod?.[1] === "off-ramp" ? tokens : currencies}
              onSelect={(value) => setSelectedFrom(value)}
              size='large'
              className='w-28'
            />
          }
        />
      </div>

      <Divider style={{ borderColor: "#333" }}>
        <SwapOutlined rotate={90} />
      </Divider>

      <div>
        <p className='font-medium mb-3'>Exchange to</p>
        <InputNumber
          key={swapMethod?.[1] === "on-ramp" ? "Token" : "Currency"}
          size='large'
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          addonBefore={
            <Select
              key={swapMethod?.[1] === "on-ramp" ? "Token" : "Currency"}
              placeholder={swapMethod?.[1] === "on-ramp" ? "Token" : "Currency"}
              options={swapMethod?.[1] === "on-ramp" ? tokens : currencies}
              size='large'
              onSelect={(value) => setSelectedTo(value)}
              className='w-28'
            />
          }
          value={10000}
        />
      </div>
    </section>
  );
}
