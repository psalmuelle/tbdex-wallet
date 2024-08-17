import { SwapOutlined } from "@ant-design/icons";
import { Divider, InputNumber, Select } from "antd";
import { useSwapType } from "@/hooks/useSwap";

export default function SwapPairs() {
    const activeSwapType = useSwapType((state)=> state.swapType)
    const swapType = {
        'on-ramp': '0',
        'off-ramp': '1', 
        'forex': '2'
    }

    

  return (
    <section className='w-fit mt-6 flex flex-col flex-wrap gap-2 border-2 p-6 rounded-xl bg-white'>
      <div>
        <p className='font-medium mb-3'>Exchange from</p>
        <InputNumber
          size='large'
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) =>
            value?.replace(/\$\s?|(,*)/g, "") as unknown as number
          }
          addonBefore={
            <Select placeholder='Currency' size='large' className='w-28' />
          }
        />
      </div>

      <Divider style={{ borderColor: "#333" }}>
        <SwapOutlined rotate={90} />
      </Divider>

      <div>
        <p className='font-medium mb-3'>Exchange to</p>
        <InputNumber
          size='large'
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          addonBefore={
            <Select placeholder='Token' size='large' className='w-28' />
          }
          value={10000}
        />
      </div>
    </section>
  );
}
