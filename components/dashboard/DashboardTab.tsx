import { Empty } from "antd";

export default function DashboardTab() {
  return (
    <section className='mb-20 mt-8'>
      <h1 className='font-semibold'>Transaction History</h1>
      <div className='mt-8'>
        <Empty description={"You do not have any transaction yet."} />
      </div>
    </section>
  );
}
