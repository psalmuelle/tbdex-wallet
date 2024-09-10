"use client";

import { Button, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import shortenText from "@/lib/shortenText";

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
      const shortenedDID = shortenText(userDID, 12, 4)

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
    <Header className='-ml-32 bg-white z-20 flex justify-end items-end sticky left-0 top-0'>
      <div className='flex justify-center items-center gap-2'>
        <Button type='primary' icon={<UserOutlined />} shape='circle' />
        <Paragraph copyable={{ text: userDID.text }} className='block mt-3.5'>
          {userDID.shortened}
        </Paragraph>
      </div>
    </Header>
  );
}
