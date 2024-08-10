"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <header className='bg-white flex flex-col justify-center relative'>
      <section className='bg-accent-dark flex justify-center items-center gap-2 text-white p-2'>
        <Image src={"/tbd-logo.jpeg"} alt='TBD logo' width={64} height={48} />
        <div className='flex flex-col w-fit'>
          <h1 className='font-bold'>This project is for the TBD hackathon</h1>
          <p>Reimagining a new world of global payments using tbDEX</p>
        </div>
      </section>

      <div className='flex justify-between items-center font-medium  px-4 py-4 md:px-6 relative'>
        <Link
          href={"/"}
          className='font-extrabold cursor-default hover:text-black'>
          tbDEX wallet
        </Link>
        <nav className='max-sm:hidden space-x-6'>
          <Link href='/about'>About us</Link>
          <Link href='/features'>Features</Link>
          <Link href='/blog'>Blog</Link>
        </nav>
        <div className='max-sm:hidden space-x-2'>
          <Button href='/login' type='text'>
            Sign In
          </Button>
          <Button
            type='primary'
            href='/register'
            className='rounded-2xl text-semibold shadow'>
            Get Started
          </Button>
        </div>
        <Button
          onClick={() => setOpenMenu(!openMenu)}
          className='sm:hidden'
          size='large'
          icon={openMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        />
      </div>

      {openMenu && (
        <div className='absolute bg-white top-full border rounded-xl w-full z-20'>
          <div className='flex flex-col justify-center gap-4 text-center py-6 mx-8'>
            <Link className='py-2' href='/about'>
              About us
            </Link>
            <Link className='py-2' href='/features'>
              Features
            </Link>
            <Link className='py-2' href='/blog'>
              Blog
            </Link>
            <div className='flex flex-col space-y-4'>
              <Button type='text' className='font-bold' href='/login'>
                Sign In
              </Button>
              <Button
                type='primary'
                size='large'
                className='rounded-2xl text-semibold shadow'
                href='/register'>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
