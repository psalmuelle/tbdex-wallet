import { Button } from "antd";

export default function Revenue() {
  return (
    <section>
      <div>
        <div className='rounded-full w-64 h-64 border bg-white flex justify-center items-center flex-col gap-4 mx-auto my-6'>
          <h1 className="font-bold text-3xl">0.0000323 ₿</h1>
          <p className="font-medium text-base">~ $145.23</p>
        </div>
        <div className="bg-white rounded-xl p-6 mt-6">
        <h1 className='font-semibold'>Transaction History</h1>
        This is going to be the transaction details of the application
        </div>
      </div>
    </section>
  );
}
