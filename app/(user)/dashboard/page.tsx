import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Dashboard() {
  const {userDID, web5} = useAuth();

  useEffect(()=>{
    console.log('userDID', userDID);
    console.log('web5', web5);
  })
  return (
    <main>
      <h1>this is the Dashboard aod the application</h1>
      <p>this is the body of the dashboard</p>
    </main>
  );
}
