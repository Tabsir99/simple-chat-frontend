"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { MiniProfileSkeleton } from "@/components/skeletons/skeleton";
import { BsChatFill } from "react-icons/bs";
import { useChatContext } from "@/components/contextProvider/chatContext";
import ActiveChats from "@/components/chats/activeChats";
import { useEffect, useMemo, useState } from "react";
import { useRecentActivities } from "@/components/contextProvider/recentActivityContext";
import SearchComp from "@/components/ui/searchComponent";
import { useParams } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeChats, isLoading } = useChatContext();
  const { updateActivity } = useRecentActivities();

  const [searchTerm, setSearchTerm] = useState("");
  const filteredChats = useMemo(() => {
    return activeChats?.filter((chat) => {
      return (
        !(chat.chatClearedAt && chat.chatClearedAt > chat.lastActivity) &&
        (chat.oppositeUsername?.includes(searchTerm) ||
          chat.roomName?.includes(searchTerm))
      );
    });
  }, [activeChats, searchTerm]);
  useEffect(() => {
    updateActivity("unseenChats", "set", 0);
  }, []);

  const params = useParams().chatId

  return (
    <>
      <div className="h-full overflow-hidden bg-[#1b1b1b] w-screen text-gray-100 flex">
        <div className={`chat-list flex flex-col max-lg2:min-w-full max-lg:w-80 bg-[#1a222d] gap-4 ${params && "max-lg2:hidden"}`}>
          <SearchComp
            title="chats"
            placeHolder="Search chats..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="ml-4 w-[calc(100%-2rem)]"
          />

          <div className={`flex flex-col gap-1 w-full px-4 max-sm:px-0 pb-4 overflow-y-auto h-full`}>
            {isLoading ? (
              <>
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
                <MiniProfileSkeleton />
              </>
            ) : filteredChats?.length && filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ActiveChats data={chat} key={chat.chatRoomId} />
              ))
            ) : (
              <div className="w-80 max-md:w-full h-64 flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6 text-center">
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
        <section className="bg-[#1d2328] overflow-hidden w-full">
          {children}
        </section>
      </div>
    </>
  );
}
