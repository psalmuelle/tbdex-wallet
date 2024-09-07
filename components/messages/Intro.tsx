import { Button } from "antd";

interface IntroProps {
  handleConvoType: (type: number) => void;
}

export default function Intro({ handleConvoType }: IntroProps) {
  return (
    <section className='bg-white p-4 sm:p-8 font-semibold rounded-xl max-w-2xl mx-auto'>
      <h1>Hi, 👋</h1>
      <p>How can I help you?</p>
      <div className='mt-8 flex flex-col gap-4'>
        <Button onClick={() => handleConvoType(0)} size={"large"}>
          I have issues while converting currencies/token {`🤔`}
        </Button>
        <Button onClick={() => handleConvoType(1)} size={"large"}>
          I want to report a bug {`🐞`}
        </Button>
      </div>
    </section>
  );
}
