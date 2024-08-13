"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userDID, setUserDID] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userDID = sessionStorage.getItem("userDID");
    if (userDID) {
      setUserDID(userDID);
    } else {
      router.push("/");
    }
  }, []);

  return (
    <main>
      <p>{userDID}</p>
      <h1>this is the Dashboard aod the application</h1>
      <p>this is the body of the dashboard</p>
    </main>
  );
}
