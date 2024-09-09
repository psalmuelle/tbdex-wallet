"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Form, FormProps, Input, message, Spin } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import initWeb5 from "@/web5/auth/access";
import {
  decryptAndRetrieveData,
  encryptAndStoreData,
} from "@/lib/encrypt-info";
import configureProtocol from "@/web5/protocols/install";

type FieldType = {
  password: string;
};

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const sessionKey = decryptAndRetrieveData({ name: "adminKey" });

  const router = useRouter();

  useEffect(() => {
    if (sessionKey) {
      router.push("/admin");
    }
  }, [sessionKey]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    await initWeb5({ password: values.password })
      .then(async (res) => {
        try {
          encryptAndStoreData({ name: "adminKey", data: values.password });
          encryptAndStoreData({ name: "userDID", data: res.userDID });
          await configureProtocol(res.web5, res.userDID);
        } catch (err) {
          console.log("Error setting userDID and web5", err);
        }
        router.push("/admin");
      })
      .catch((error) => {
        console.log("Error initializing web5", error);
        messageApi.error(error.toString());
        setLoading(false);
      });
  };

  return (
    <main className='flex justify-center items-center min-h-[80vh] px-4'>
      <section className='w-full max-w-m max-w-sm my-20 p-4 md:p-6 bg-white rounded-2xl text-center shadow'>
        <h1 className='mt-8 font-bold text-base'>Admin Login</h1>

        <div className='flex justify-center items-center mt-4 mb-2'>
          <Image
            src={"/3d-picture.png"}
            width={200}
            height={200}
            alt='Access your wallet'
          />
        </div>
        <Form
          name='admin login'
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
            Access
          </Button>
        </Form>
      </section>
      <Spin spinning={loading} fullscreen size='large' />
      {contextHolder}
    </main>
  );
}
