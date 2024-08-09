import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Layout } from "antd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

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
          <Header />
          <Layout>{children}</Layout>
          <Footer />
        </Layout>
      </body>
    </html>
  );
}
