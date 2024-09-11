import { Avatar } from "antd";

export interface MessageProps {
  id: string;
  msg: string;
  time: string;
  isUser: boolean;
  adminName?: string;
}

function Message({ msg, time, isUser, adminName }: MessageProps) {
  return isUser ? (
    <div className='my-2 ml-auto w-fit'>
      <p className='p-4 rounded-2xl rounded-tr-none bg-neutral-100 w-fit max-w-sm'>
        {msg}
      </p>

      <p className='pl-2 text-gray-500 text-xs'>{time}</p>
    </div>
  ) : (
    <div className='flex gap-1 my-2 w-fit'>
      <Avatar
        src='https://api.dicebear.com/9.x/notionists/svg?seed=Abby'
        alt='avatar'
      />
      <div className=''>
        <p className='my-2 text-xs font-medium'>{adminName}</p>
        <p className='p-4 rounded-2xl rounded-tl-none bg-neutral-100 w-fit max-w-sm'>
          {msg}
        </p>
        <p className='text-right pr-2 text-gray-500 text-xs'>{time}</p>
      </div>
    </div>
  );
}

export default function Chat({
  messages,
  scrollRef,
}: {
  messages: MessageProps[];
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={scrollRef}
      className='bg-white rounded-xl p-4 max-h-[65vh] flex flex-col overflow-y-auto custom-scrollbar'>
      {messages.map((message, i) => {
        return (
          <Message
            id={message.id}
            key={i}
            msg={message.msg}
            time={message.time}
            isUser={message.isUser}
            adminName={message.adminName}
          />
        );
      })}
    </div>
  );
}
