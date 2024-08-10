import { Button } from "antd";
import {
  CreditCardOutlined,
  FieldTimeOutlined,
  FileProtectOutlined,
  IdcardOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import Image from "next/image";

export default function Home() {
  return (
    <main className='mx-auto'>
      <section className='mt-10 px-4 text-center max-w-xl mx-auto'>
        <h1 className='text-4xl font-extrabold mb-4'>
          Reimagining The World Of Global Payments And Commerce
        </h1>
        <p>
          Be part of the revolution in global payments and commerce. With TBDEX
          Wallet, the world is your marketplace.
        </p>
        <Button
          iconPosition='end'
          size='large'
          icon={<LoginOutlined />}
          type='primary'
          className='mt-6 font-semibold'>
          Create Wallet
        </Button>
      </section>
      <div className='mt-12 border-b border-accent-dark px-4 max-w-2xl mx-auto'>
        <Image
          src={"/homepage-pic.jpg"}
          alt='cross border payment'
          width={924}
          height={450}
          className='rounded-t-xl drop-shadow'
        />
      </div>
      <p className='font-mono font-bold text-center mt-14'>Built for you</p>

      <section className='mt-12 px-4'>
        <div className='flex gap-4 max-w-2xl justify-between items-center flex-wrap mx-auto'>
          <div className='border p-4 max-w-xs h-52 rounded-lg bg-white shadow'>
            <IdcardOutlined className='text-4xl text-[#4096ff]' />
            <h1 className='font-bold text-base mt-3'>
              Protect your personal data
            </h1>
            <p className='mt-2'>
              We don't have to know your body weight before you carry out a
              transaction. With DIDs, you can easily import your data. No need
              to start another KYC process
            </p>
          </div>

          <div className='border p-4 max-w-xs h-52 rounded-lg bg-white shadow'>
            <CreditCardOutlined className='text-4xl text-[#4096ff]' />
            <h1 className='font-bold text-base mt-3'>Cross Border Payment</h1>
            <p className='mt-2'>
              Exchange currencies and make cross border payment with tbDex
              messaging protocol
            </p>
          </div>

          <div className='border p-4 max-w-xs h-52 rounded-lg bg-white shadow'>
            <FileProtectOutlined className='text-4xl text-[#4096ff]' />
            <h1 className='font-bold text-base mt-3'>Best rates</h1>
            <p className='mt-2'>
              Make on and off-ramp transactions at competitive rates from our
              PFIs.
            </p>
          </div>

          <div className='border p-4 max-w-xs h-52 rounded-lg bg-white shadow'>
            <FieldTimeOutlined className='text-4xl text-[#4096ff]' />
            <h1 className='font-bold text-base mt-3'>Fast</h1>
            <p className='mt-2'>
              Complete transactions within few minutes and seconds
            </p>
          </div>
        </div>
      </section>
      <section className='w-[95vw] mx-auto bg-accent-dark rounded-xl mt-12 py-14 max-md:py-10 max-md:px-4 px-8'>
        <div>
          <h1 className='text-white text-3xl font-bold mt-8 text-center max-w-sm mx-auto'>
            Effortlessly Manage Your Blah Blah And This
          </h1>
          <p className='text-white text-center mt-4'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget
            ipsum.
          </p>
          <div className='w-fit mx-auto mt-8 mb-12'>
            <Button className='mx-auto font-semibold' size='large'>
              Sign Up Now
            </Button>
          </div>
        </div>
        <div className='max-w-3xl mx-auto'>
          <Image
            src={"/hero-section.jpg"}
            alt='cross border payment'
            width={1024}
            height={950}
            className='rounded-3xl drop-shadow w-full mx-auto'
          />
        </div>
      </section>
    </main>
  );
}
