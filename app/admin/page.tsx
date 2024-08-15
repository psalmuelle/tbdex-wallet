"use client";
import { useSession } from "next-auth/react";
import { Spin } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      router.push("/admin/auth");
    }
  }, [status]);

  if (status === "loading")
    return <Spin fullscreen size='large' tip={"Loading"} />;
  return (
    <main className='min-h-[80vh] px-4'>
      {session?.user?.email}
      <div>This is the homepage of the admin dashboard</div>
    </main>
  );
}
