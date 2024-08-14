"use client";

import { useState } from "react";
import { Button, Form, Input, Spin, message } from "antd";
import type { FormProps } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import initWeb5 from "@/lib/web5";
import { useRouter } from "next/navigation";
import { encryptAndStoreData } from "@/lib/encrypt-info";

type FieldType = {
  password: string;
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    await initWeb5({ password: values.password })
      .then((res) => {
        try {
          encryptAndStoreData({ name: "userDID", data: res.userDID });
        } catch (err) {
          console.log("Error setting userDID and web5", err);
        }
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log("Error initializing web5", error);
        messageApi.error(error.toString());
        setLoading(false);
      });
  };

  return (
    <main className='flex justify-center items-center min-h-[90vh] px-4'>
      <section className='w-full max-w-m max-w-sm my-20 p-4 md:p-6 bg-white rounded-2xl text-center shadow'>
        <h1 className='mt-8 font-bold text-base italic'>Hi 👋,</h1>
        <p className='mt-4 '>
          Welcome to ChainWallet! Experience seamless access to on- and off-ramp
          exchanges and cutting-edge security.
        </p>
        <div className='flex justify-center items-center mt-4 mb-2'>
          <Image
            src={"/onboard-pic.png"}
            width={200}
            height={200}
            alt='Access your wallet'
          />
        </div>
        <div className='my-8'>
          <Form
            name='create account'
            layout='vertical'
            onFinish={onFinish}
            autoComplete='off'>
            <Form.Item<FieldType>
              label='Password'
              name='password'
              className='text-left'
              rules={[
                { required: true, message: "Please input your password!" },
              ]}>
              <Input.Password
                size='large'
                placeholder='input password'
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Button
              type='primary'
              htmlType='submit'
              size='large'
              iconPosition='end'
              className='mt-4 w-full'
              icon={<LoginOutlined />}>
              Sign In to Your Wallet
            </Button>
          </Form>
        </div>
      </section>
      <Spin spinning={loading} fullscreen tip={"Loading"} size='large' />
      {contextHolder}
    </main>
  );
}
