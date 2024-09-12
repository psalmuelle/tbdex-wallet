import { Button } from "antd";
import { set } from "mongoose";
import { useState } from "react";

interface IntroProps {
  handleConvoType: (title: string) => void;
}

export default function Intro({ handleConvoType }: IntroProps) {
  const [isButtonClicked, setIsButtonClicked] = useState({
    transactionIssue: false,
    bugReport: false,
  });

  return (
    <section className='bg-white p-4 sm:p-8 font-semibold rounded-xl max-w-2xl mx-auto'>
      <h1>Hi, 👋</h1>
      <p>How can I help you?</p>
      <div className='mt-8 flex flex-col gap-4'>
        <Button
          loading={isButtonClicked.transactionIssue}
          className='text-wrap h-fit'
          onClick={() => {
            setIsButtonClicked({ ...isButtonClicked, transactionIssue: true });
            handleConvoType("Transaction Issue");
          }}
          size={"large"}>
          I have issues while converting currencies/token {`🤔`}
        </Button>
        <Button
          loading={isButtonClicked.bugReport}
          className='text-wrap h-fit'
          onClick={() => {
            setIsButtonClicked({ ...isButtonClicked, bugReport: true });
            handleConvoType("Bug report");
          }}
          size={"large"}>
          I want to report a bug {`🐞`}
        </Button>
      </div>
    </section>
  );
}
