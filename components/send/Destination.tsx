import { Avatar } from "antd";

interface DestinationProps {
  flag: string;
  country: string;
  currency: string;
  currencySymbol: string;
  alt: string;
  onClick: () => void;
}

export default function Destination({
  flag,
  country,
  currency,
  currencySymbol,
  alt,
  onClick,
}: DestinationProps) {
  return (
    <div
      onClick={onClick}
      className='flex justify-start items-center gap-2 cursor-pointer w-full h-16 py-2 px-1 rounded-xl hover:bg-neutral-100 transition-all ease-linear duration-300'>
      <Avatar size={32} src={flag} alt={alt} />
      <div>
        <h2 className='font-medium text-neutral-900'>{country}</h2>
        <p className='text-xs font-medium text-neutral-500 mt-1'>
          {currency} &#40;{currencySymbol}&#41;
        </p>
      </div>
    </div>
  );
}
