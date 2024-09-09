import { InfoCircleOutlined } from "@ant-design/icons";

interface CredentialCardProps {
  name: string;
  country: string;
  issuedBy: string;
  expires: string;
}

export default function CredentialCard({
  name,
  country,
  issuedBy,
  expires,
}: CredentialCardProps) {
  return (
    <div
      style={{ backgroundImage: "url('/kcc-card.png')" }}
      className='p-4 text-white w-[400px] max-sm:w-[300px] bg-contain max-sm:h-[170px] h-[225px] bg-no-repeat max-sm:p-2'>
      <div>
        <h1 className='text-center font-semibold'>Known Customer Credential</h1>
      </div>
      <div className='mt-6 max-sm:mt-4'>
        <h2 className='font-medium'>
          <InfoCircleOutlined /> Information
        </h2>
        <div className='mt-4 max-sm:mt-2'>
          <p>
            Full Name: <span className='font-medium'>{name}</span>
          </p>
          <p>
            Country: <span className='font-medium'>{country}</span>
          </p>
        </div>
      </div>
      <div className='flex justify-between'>
        <div />
        <div className='w-fit mt-4 max-sm:mt-2 flex flex-col'>
          <p>
            Issued by: <span className='font-medium'>{issuedBy}</span>
          </p>
          <p>Expires: {expires}</p>
        </div>
      </div>
    </div>
  );
}
