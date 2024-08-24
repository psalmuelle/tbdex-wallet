import { InfoCircleOutlined } from "@ant-design/icons";

interface CredentialCardProps {
  name: string;
  country: string;
  email: string;
  issuedBy: string;
  expires: string;
}

export default function CredentialCard({name, country, email, issuedBy, expires}: CredentialCardProps) {
  return (
    <div
      style={{ backgroundImage: "url('/kcc-card.png')" }}
      className='p-4 text-white w-[400px] max-sm:w-[300px] bg-contain max-sm:h-[170px] h-[225px] bg-no-repeat max-sm:p-2'>
      <div>
        <h1 className='text-center font-semibold'>Known Customer Credential</h1>
      </div>
      <div className='mt-6 max-sm:mt-2'>
        <h2 className='font-medium max-sm:hidden'>
          <InfoCircleOutlined /> Information
        </h2>
        <div className='mt-4 max-sm:mt-3'>
          <p>
            Full Name: <span className='font-medium'>{name}</span>
          </p>
          <p>
            Country: <span className='font-medium'>{country}</span>
          </p>
          <p>
            Email: <span className='font-medium'>{email}</span>
          </p>
        </div>
      </div>
      <div className='flex justify-between'>
        <div />
        <div className='w-fit mt-4 max-sm:mt-3 flex flex-col'>
          <p>
            Issued by:{" "}
            <span className='font-medium'>{issuedBy}</span>
          </p>
          <p>Expires: {expires}</p>
        </div>
      </div>
    </div>
  );
}
