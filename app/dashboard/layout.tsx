import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Layout } from "antd";
import Footer from "@/components/Footer";
import "../globals.css";
import DashboardSider from "@/components/Sider";
import DashboardHeader from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CHAIN WALLET",
  description:
    "Chain Wallet is a digital wallet designed for use with the TBDEX decentralized exchange. This wallet facilitates secure and private financial transactions, enabling users to trade and manage digital assets without relying on traditional intermediaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={inter.className + " max-w-[1440px] mx-auto bg-neutral-100"}>
        <Layout hasSider>
          <DashboardSider />
          <Layout className='ms-52 max-sider:ms-20'>
            <DashboardHeader />
            {children}
            <Footer />
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
