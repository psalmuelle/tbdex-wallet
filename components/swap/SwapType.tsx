"use client";

import { Button, Tooltip } from "antd";
import { useSwapType } from "@/hooks/useSwap";

interface SwapTypeButtonTypes {
  active: boolean;
  text: string;
  info: string;
  onSelect: () => void;
}

function SwapTypeButton({ active, text, info, onSelect }: SwapTypeButtonTypes) {
  return (
    <Tooltip title={info}>
      <Button
        type={active ? "primary" : "default"}
        onClick={onSelect}
        className='w-[90px] max-sm:w-20'>
        {text}
      </Button>
    </Tooltip>
  );
}

const allSwapTypes = [
  {
    id: "0",
    text: "On-Ramp",
    info: "Convert fiat currencies to crypto tokens, e.g USD ➩ BTC",
  },
  {
    id: "1",
    text: "Off-Ramp",
    info: "Convert cryto tokens to fiat currencies, e.g BTC ➩ USD",
  },
  {
    id: "2",
    text: "Forex",
    info: "Convert from one fiat currency to another, e.g USD ➩ EUR",
  },
];
export default function SwapType() {
  const activeSwap = useSwapType((state) => state.swapType);
  const setSwapType = useSwapType((state) => state.setSwapType);

  const handleSelect = (text: string) => {
    setSwapType(text.toLowerCase());
  };

  return (
    <section className='flex flex-wrap gap-4 max-sm:gap-2 border p-2 rounded-xl w-fit'>
      {allSwapTypes.map((val) => {
        return (
          <SwapTypeButton
            key={val.id}
            active={val.text.toLowerCase() === activeSwap}
            text={val.text}
            info={val.info}
            onSelect={() => handleSelect(val.text)}
          />
        );
      })}
    </section>
  );
}
