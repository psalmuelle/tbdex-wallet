"use client";
import { UserOutlined } from "@ant-design/icons";
import { Layout } from "antd";

const { Content } = Layout;

export default function KCC() {
  return (
    <Content className='mt-8 mx-4'>
      <div>
        <UserOutlined />
        <h1>My Verifiable Credentials</h1>
      </div>
      <section>
        <h2>My Credentials</h2>
        <p>Here are the credentials that you have been issued by the KCC</p>
      </section>
    </Content>
  );
}
