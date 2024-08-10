import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Layout, Button } from "antd";
import Link from "next/link";
import Footer from "@/components/Footer";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TBDEX WALLET",
  description:
    "The TBDEX Wallet is a digital wallet designed for use with the TBDEX decentralized exchange. This wallet facilitates secure and private financial transactions, enabling users to trade and manage digital assets without relying on traditional intermediaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className + " max-w-[1440px] mx-auto"}>
        <Layout>
          <header className='bg-white flex flex-col justify-center relative'>
            <div className='flex justify-between items-center font-medium  px-4 py-4 md:px-6 relative'>
              <Link
                href={"/"}
                className='font-extrabold cursor-default hover:text-black'>
                tbDEX wallet
              </Link>

              <div className='space-x-2'>
                <Button type='text'>Sign In</Button>
                <Button
                  type='primary'
                  className='rounded-2xl text-semibold shadow'>
                  Get Started
                </Button>
              </div>
            </div>
          </header>
          <Layout>{children}</Layout>
          <Footer />
        </Layout>
      </body>
    </html>
  );
}
