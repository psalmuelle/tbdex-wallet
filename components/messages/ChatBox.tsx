import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import Chat from "./Chat";

export default function ChatBox() {
  return (
    <section>
      <Chat />
      {/* The input field for sending message */}
      <div className='flex gap-2 items-center w-full mt-4 max-w-xl mx-auto'>
        <Input.TextArea
          style={{ resize: "none", height: "40px" }}
          size={"large"}
          classNames={{ textarea: "overflow-hidden" }}
          placeholder='Type your message here'
        />
        <Button size='large' shape={"circle"} icon={<SendOutlined />} />
      </div>
    </section>
  );
}
