"use client";

import { Button, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";

const { Header } = Layout;
const { Paragraph } = Typography;

export default function DashboardHeader() {
  const [userDID, setUserDID] = useState({
    text: "",
    shortened: "",
  });
  const router = useRouter();

  useEffect(() => {
    const userDID = decryptAndRetrieveData({ name: "userDID" });
    if (userDID) {
      const shortenedDID =
        userDID.substring(0, 12) +
        "...." +
        userDID.substring(userDID.length - 4);

      setUserDID((prevState) => ({
        ...prevState,
        text: userDID,
        shortened: shortenedDID,
      }));
    } else {
      router.push("/");
    }
  }, []);
  return (
    <Header className='bg-white flex justify-end items-end'>
      <div className='flex justify-center items-center gap-2'>
        <Button type='primary' icon={<UserOutlined />} shape='circle' />
        <Paragraph copyable={{ text: userDID.text }} className='block mt-3.5'>
          {userDID.shortened}
        </Paragraph>
      </div>
    </Header>
  );
}
