import { InfoCircleOutlined } from "@ant-design/icons";

export default function CredentialCard() {
  return (
    <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl max-w-sm drop-shadow p-4 text-white'>
      <div>
        <h1 className='text-center font-semibold'>Known Customer Credential</h1>
      </div>
      <div className='mt-6 '>
        <h2 className='font-medium'>
          <InfoCircleOutlined /> Information
        </h2>
        <div className='mt-4 bg-white/95 p-2 rounded-lg text-black'>
          <p>Full Name: {"John Doe"}</p>
          <p>Country: {"NGN"}</p>
          <p>Email: {"example@gmail.com"}</p>
        </div>
      </div>
      <div className='flex justify-between'>
        <div />
        <div className='w-fit mt-4 flex flex-col'>
          <p>
            Issued by:{" "}
            <span className='font-medium'>{"did:dht:2162...2123"}</span>
          </p>
          <p>Expires: {"24-10-2024"}</p>
        </div>
      </div>
    </div>
  );
}
