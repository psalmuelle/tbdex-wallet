import ConversationList from "./ConversationList";

export default function Messages() {
  return (
    <div>
      <h1 className='font-semibold mt-6'>Customers Messages</h1>
      <div className='mt-8 p-4 bg-white w-full rounded-xl min-h-96'>
        <ConversationList />
      </div>
    </div>
  );
}
