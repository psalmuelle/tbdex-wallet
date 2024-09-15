export default function TnxList({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className='flex justify-between items-center gap-4 py-2 max-w-sm mx-auto'>
      <h2 className='uppercase text-neutral-500'>{title}</h2>
      <p className='text-neutral-700'>{value}</p>
    </div>
  );
}
