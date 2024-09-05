import Image from "next/image";

type QuickActionProps = {
  title: string;
  imageSrc: string;
  description: string;
  onClick: () => void;
};

export default function QuickAction({
  title,
  imageSrc,
  description,
  onClick,
}: QuickActionProps) {
  return (
    <div
      className='max-w-[300px] min-w-[225px] min-h-[180px] border rounded-xl p-4 cursor-pointer hover:border-[#4096ff] text-gray-600 hover:text-gray-800'
      onClick={onClick}>
      <Image
        src={imageSrc}
        alt='avatar'
        width={40}
        height={40}
        className='mb-4 w-10 h-10'
      />
      <h3 className='font-bold'>{title}</h3>
      <p className='text-gray-700 mt-2'>{description}</p>
    </div>
  );
}
