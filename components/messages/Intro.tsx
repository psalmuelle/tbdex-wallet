import { Button } from "antd";

export default function Intro() {
  return (
    <section className='bg-white p-4 sm:p-8 font-semibold rounded-xl max-w-2xl mx-auto'>
      <h1>Hi, 👋</h1>
      <p>How can I help you?</p>
      <div className='mt-8 flex flex-col gap-4'>
        <Button size={'large'}>I have issues while converting currencies/token {`🤔`}</Button>
        <Button size={'large'}>I want to report a bug {`🐞`}</Button>
      </div>
    </section>
  );
}
