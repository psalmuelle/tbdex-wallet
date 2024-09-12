import { SendOutlined } from "@ant-design/icons";
import { Button, Empty, Form, FormProps, Input } from "antd";
import Chat, { MessageProps } from "./Chat";
import type { Web5 } from "@web5/api";
import { createChat } from "@/web5/messages/create";
import { useState, useRef, useEffect } from "react";

export default function ChatBox({
  messages,
  web5,
  parentId,
  receiverDid,
  isUser,
  adminName,
}: {
  messages: MessageProps[];
  web5: Web5;
  receiverDid?: string;
  parentId: string;
  isUser: boolean;
  adminName?: string;
}) {
  const [form] = Form.useForm();
  const [allMessages, setAllMessages] = useState<MessageProps[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef.current, allMessages]);

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  const onFinish: FormProps<{ chat: string }>["onFinish"] = async (values) => {
    if (!values.chat) return;
    //Send Message
    form.resetFields();
    const sentMessage = await createChat({
      web5: web5,
      chat: { msg: values.chat, createdAt: new Date().toISOString() },
      parentId: parentId,
      receiverDid: receiverDid || undefined,
    });

    console.log(sentMessage);
    if (sentMessage && sentMessage.record) {
      console.log(await sentMessage.record.data.json());
      setAllMessages((prev) => [
        ...prev,
        {
          msg: values.chat,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          isUser: isUser,
          adminName: adminName,
          id: sentMessage.record!.id,
        },
      ]);
    }
  };

  return (
    <section>
      {messages.length > 0 && (
        <Chat scrollRef={scrollRef} messages={allMessages} />
      )}
      {messages.length === 0 && (
        <div className='bg-white rounded-xl p-4'>
          <Empty
            className='my-10'
            description='No messages yet'
            children={<p className='font-medium'>Drop a message</p>}
          />
        </div>
      )}

      {/* The input field for sending message */}
      <div>
        <Form
          form={form}
          className='gap-2 items-center flex-nowrap flex w-full mt-4 max-w-xl mx-auto h-fit'
          name='chatbox'
          layout={"horizontal"}
          onFinish={onFinish}
          autoComplete='off'>
          <Form.Item<{ chat: string }> name={"chat"} className='w-full'>
            <Input.TextArea
              style={{ resize: "none", height: "40px" }}
              size={"large"}
              classNames={{ textarea: "overflow-hidden" }}
              placeholder='Type your message here'
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType='submit'
              size='large'
              shape={"circle"}
              icon={<SendOutlined />}
            />
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
