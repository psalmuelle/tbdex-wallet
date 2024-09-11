import shortenText from "@/lib/shortenText";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Empty } from "antd";

function Convo({
  userDid,
  text,
  time,
  handleOpenChat,
}: {
  userDid: string;
  text: string;
  time: string;
  handleOpenChat: () => void;
}) {
  return (
    <div
      onClick={handleOpenChat}
      className='flex justify-between items-center border rounded-xl p-2 cursor-pointer hover:border-[#4096ff] hover:bg-neutral-50 transition-all'>
      <div className='flex items-center'>
        <Badge dot>
          <Avatar icon={<UserOutlined />} />
        </Badge>
        <div className='ml-4'>
          <p className='font-semibold'>{shortenText(userDid, 12, 4)}</p>
          <p className='text-sm'>{text}</p>
        </div>
      </div>
      <div>
        <p className='text-sm'>{time}</p>
      </div>
    </div>
  );
}

export default function ConversationList({
  conversations,
}: {
  conversations: {
    user: string;
    text: string;
    time: string;
  }[];
}) {
  return (
    <section>
      {conversations.length === 0 ? (
        <div className='mt-8'>
          <Empty
            description='No messages yet'
            children={
              <p className='font-medium'>Seems everyone's happy 👻...</p>
            }
          />
        </div>
      ) : (
        <div className='mt-4 py-4 px-2 flex flex-col gap-4'>
          {conversations.map((convo, i) => {
            const dateObj = new Date(convo.time);

            const formattedDate = new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }).format(dateObj);

            return (
              <Convo
                key={i}
                userDid={convo.user}
                text={convo.text}
                time={formattedDate}
                handleOpenChat={() => console.log("open chat")}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
