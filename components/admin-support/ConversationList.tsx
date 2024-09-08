import type { Record } from "@web5/api";
import { Empty } from "antd";

export default function ConversationList({
  conversations,
}: {
  conversations: Record[];
}) {
  return (
    <section>
      {conversations.length === 0 ? (
        <div className='mt-8'>
          <Empty
            description='No messages yet'
            children={<p className="font-medium">Seems everyone's happy 👻...</p>}
          />
        </div>
      ) : (
        <div>Conversations is going to be displayed here! Gracias</div>
      )}
    </section>
  );
}
