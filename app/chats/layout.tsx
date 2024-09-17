import ChatSidebar from "@/components/chats/chatSidebar";
import Search from "@mui/icons-material/Search";
import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how's it going?",
      unread: true,
      newMessageCount: 3,
      lastMessageTime: "10:35",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Can we meet tomorrow?",
      unread: false,
      newMessageCount: 3,
      lastMessageTime: "10:35",
    },
    {
      id: 3,
      name: "James Bond",
      lastMessage: "Mission accomplished.",
      unread: true,
      newMessageCount: 2,
      lastMessageTime: "10:35",
    },
  ];

  return (
    <>
      <div className="h-full bg-[#1b1b1b] w-screen text-gray-100 flex">
        <ChatSidebar />
        <div className="chat-list px-4 space-y-4 bg-[#1c222a] bg-opacity-90">
          <h1 className="text-2xl font-bold pt-3"> Chats </h1>
          <div className="relative mb-6 bg-gray-700 bg-opacity-50 overflow-hidden rounded-md flex items-center px-3">
            <Search />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full p-3 bg-transparent text-[18px] rounded-lg text-gray-300 placeholder-gray-400 outline-none"
            />
          </div>
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href='/chats/chat1'
              className={`flex items-center  w-80 py-3 hover:cursor-pointer px-4 bg-[#252a32] rounded-lg transition-all duration-300 ease-in-out hover:bg-[#272e38] `}
            >
              <div className="avatar w-12 h-12 bg-[#434343] rounded-full mr-4 relative">
                {chat.unread && (
                  <span className=" h-3 w-3 bg-green-500 border-2 border-gray-700 rounded-full block absolute bottom-0.5 right-0.5"></span>
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <h2 className="text-[18px] font-bold">{chat.name}</h2>
                <p className="text-gray-400 text-[16px] truncate">
                  {chat.lastMessage.length > 20
                    ? chat.lastMessage.slice(0, 20) + "..."
                    : chat.lastMessage}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <span className="text-[14px]"> {chat.lastMessageTime} </span>
                <span className="bg-blue-600 rounded-full w-4 h-4 flex justify-center items-center text-[14px]">
                  {" "}
                  {chat.newMessageCount}{" "}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <section className="bg-[#292f36] w-full">
          {children}
        </section>
      </div>
    </>
  );
}
