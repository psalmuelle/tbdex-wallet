import { BankOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Offerings() {
  return (
    <section className='mt-8'>
      <h1 className='font-semibold mb-6'>
        <span>
          <BankOutlined className='text-xl' />{" "}
        </span>
        Offerings
      </h1>

      <div className="text-center">
        <p>Offerings from PFIs will be here!</p>
        <Spin className="flex justify-center items-center"/>
        <p>Thank you</p>
      </div>
    </section>
  );
}
