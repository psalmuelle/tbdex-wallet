"use client";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import CredentialCard from "@/components/credentials/CredentialCard";
import { Layout } from "antd";
import { Web5 } from "@web5/api";
import { useEffect } from "react";
import { VerifiableCredential } from "@web5/credentials";
import { BearerDid } from "@web5/dids";

const { Content } = Layout;



export default function KCC() {
  const password = decryptAndRetrieveData({ name: "sessionKey" });

  useEffect(()=>{
    async function sample(){
      const {web5, did:userDID} = await Web5.connect({password: password})
      // const vc = await VerifiableCredential.create({
      //   type: 'EmploymentCredential',
      //   issuer: 'did:dht:fhzeks5bkferfztk6m63xjkg7a4hbf7snk444g8f1h1xapt391ty',
      //   subject: userDID,
      //   expirationDate: '2024-09-30T12:34:56Z',
      //   data: {
      //     "position": "Software Developer",
      //     "startDate": "2023-04-01T12:34:56Z",
      //     "employmentStatus": "Contractor"
      //   }
      // });
      // const vc_jwt_employment = await vc.sign({ did: web5.agent.agentDid });

      // console.log(vc_jwt_employment)

      await web5.dwn.records.create({
        data: '',
        message: {
          schema: 'EmploymentCredential',
          dataFormat: 'application/vc+jwt'
        },
      })

    const allVcs = await  web5.dwn.records.query({
        message: {
          filter: {
            dataFormat: "application/vc+jwt",
          }
        }
      })
      console.log(allVcs)
    }
  // sample()
  }, [])

  console.log(password);
  return (
    <Content className='mt-8 mx-4'>
      <div>
        <h1 className='font-bold text-base mb-4'>My Verifiable Credentials</h1>
      </div>

      <section className='min-h-[75vh] mt-12'>
        <CredentialCard />
      </section>
    </Content>
  );
}
