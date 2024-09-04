"use client";
import Intro from "@/components/messages/Intro";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Layout } from "antd";

const { Content } = Layout;
export default function Support() {
  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Customer Support</h1>
      <Intro />
      <section>
        <div className="pt-8">
          {/* User */}
          <div className='my-4 ml-auto w-fit'>
            <p className='p-4 rounded-2xl rounded-tr-none bg-white w-fit max-w-sm'>
              I will make sure I sue your company if you don't send me my money
              asap.
            </p>

            <p className='pl-2 text-gray-800 italic'>9:25pm</p>
          </div>

          {/* Customer Care Unit */}
          <div className='flex gap-1 my-4 w-fit'>
            <Avatar
              src='https://api.dicebear.com/9.x/notionists/svg?seed=Abby'
              alt='avatar'
            />
            <div className=''>
              <p className='my-2'>Sam from Chain Wallet</p>
              <p className='p-4 rounded-2xl rounded-tl-none bg-white w-fit max-w-sm'>
                Hi, I am sorry for the inconvenience. Can you please provide me
                with the `exchangeId` for the order?
              </p>
              <p className='text-right pr-2 text-gray-800 italic'>9:25pm</p>
            </div>
          </div>
        </div>

        {/* The input field for sending message */}
        <div className='flex gap-2 items-center sticky bottom-4 w-full mt-6 max-w-3xl mx-auto'>
          <Input.TextArea
            style={{ resize: "none", height: '40px' }}
            size={"large"}
            classNames={{ textarea: "overflow-hidden" }}
            placeholder='Type your message here'
          />
          <Button size='large' shape={"circle"} icon={<SendOutlined />} />
        </div>
      </section>
    </Content>
  );
}
