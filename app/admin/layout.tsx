import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Layout } from "antd";
import Image from "next/image";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import "../globals.css";

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
    <SessionWrapper>
      <html lang='en'>
        <body className={inter.className + " max-w-[1440px] mx-auto"}>
          <Layout>
            <header className='bg-white flex justify-center items-center py-4 border-b'>
              <Image
                src={"/logo.png"}
                width={36}
                height={36}
                alt={"Chain wallet"}
              />
              <p className='text-base font-mono font-bold tracking-widest'>
                Chain Wallet - Admin Dashboard
              </p>
              <Image
                src={"/logo.png"}
                width={36}
                height={36}
                alt={"Chain wallet"}
              />
            </header>
            <Layout>{children}</Layout>
            <Footer />
          </Layout>
        </body>
      </html>
    </SessionWrapper>
  );
}
