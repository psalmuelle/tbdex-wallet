"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { Button, Spin } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && status === "authenticated") {
      router.push("/admin");
    }
  }, [status]);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/admin" });
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
        <div className='my-8'>
          <Button
            type='primary'
            onClick={handleLogin}
            size='large'
            iconPosition='end'
            className='mt-4 w-full'
            icon={<LoginOutlined />}>
            Google Sign In
          </Button>
        </div>
      </section>
      <Spin spinning={loading} fullscreen size='large' />
    </main>
  );
}
