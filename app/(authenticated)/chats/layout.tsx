"use client";

import ChatSidebar from "@/components/chats/chatSidebar";
import { Search } from "lucide-react";
import Link from "next/link";
import { MiniProfileSkeleton } from "@/components/skeletons/skeleton";
import { BsChatFill } from "react-icons/bs";
import { useChatContext } from "@/components/contextProvider/chatContext";
import ActiveChats from "@/components/chats/activeChats";
import { useEffect } from "react";
import { useRecentActivities } from "@/components/contextProvider/recentActivityContext";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { activeChats, isLoading } = useChatContext();
  const { updateActivity } = useRecentActivities()

  useEffect(() => {
    updateActivity("unseenChats","set",0)
  },[])

  return (
    <>
     
      <div className="h-full overflow-hidden bg-[#1b1b1b]  w-screen text-gray-100 flex">
        <ChatSidebar />
        <div className="chat-list px-4 flex flex-col bg-[#1a222d]">
          <h1 className="text-2xl font-bold pt-4 mb-4"> Chats </h1>
          <div className="relative mb-6 bg-gray-700 bg-opacity-50 rounded-md flex items-center">
            <Search className="absolute left-3" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full focus:border-gray-600 border-transparent py-3 bg-transparent text-[18px] border-2 pl-10 pr-4 rounded-md text-gray-300 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex flex-col gap-3 pr-2 pb-4 overflow-y-auto h-full">
            {isLoading ? (
              <>
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
              </>
            ) : activeChats?.length && activeChats.length > 0 ? (
              activeChats.map((chat) => (
                <ActiveChats data={chat} key={chat.chatRoomId} />
              ))
            ) : (
              <div className="w-80 h-64 flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6 text-center">
                <BsChatFill className="text-5xl mb-4 text-gray-500" />

                <p className="text-gray-300 text-lg mb-4">No active chats</p>
                <Link
                  href="/search-people"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Search People
                </Link>
              </div>
            )}
          </div>
        </div>
        <section className="bg-[#1d2328] overflow-hidden w-full">{children}</section>
      </div>

    </>
  );
}




