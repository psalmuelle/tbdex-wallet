import { Avatar } from "antd";

function Message({
  message,
  time,
  isUser,
  adminName,
}: {
  message: string;
  time: string;
  isUser: boolean;
  adminName?: string;
}) {
  return isUser ? (
    <div className='my-2 ml-auto w-fit'>
      <p className='p-4 rounded-2xl rounded-tr-none bg-neutral-100 w-fit max-w-sm'>
        {message}
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
          {message}
        </p>
        <p className='text-right pr-2 text-gray-500 text-xs'>{time}</p>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <div className='bg-white rounded-xl p-4 max-h-[65vh] flex flex-col overflow-y-auto custom-scrollbar'>
        <Message
            message='Hi, how can I help you?'
            time='10:00 AM'
            isUser={false}
            adminName='Abby'
        />
        <Message
            message='I have issues while converting currencies/token 🤔'
            time='10:01 AM'
            isUser={true}
        />
        <Message
            message='I want to report a bug 🐞'
            time='10:02 AM'
            isUser={true}
        />
    </div>
  );
}
