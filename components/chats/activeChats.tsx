import React from "react";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import { IChatHead } from "@/types/chatTypes";
import { useParams } from "next/navigation";


const ActiveChats = ({ data }: { data: IChatHead }) => {
  const params = useParams()

  return (
    <Link
      href={`/chats/${data.chatRoomId}`}
      className="flex items-center w-80 py-3 px-4 bg-[#232b36] rounded-lg transition-all duration-300 ease-in-out hover:bg-[#252f3a]"
    >
      <div className="relative w-12 h-12 mr-4">
        <div className="w-full h-full border border-gray-600 bg-[#222b35] rounded-full flex justify-center items-center">
          {data.isGroup ? (
            <span className="uppercase text-base text-gray-300">GC</span>
          ) : data.roomImage ? (
            <img src={data.roomImage} alt="Profile pic" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="uppercase text-base text-gray-300">{data.roomName.slice(0, 2)}</span>
          )}
        </div>
        <span
          className={`absolute h-3 w-3 border-2 border-gray-700 rounded-full bottom-0.5 right-0.5 ${
            data.isGroup || data.roomStatus === "online" ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-[18px] text-gray-300 capitalize truncate">{data.roomName}</h2>
        {data.isTyping && data.chatRoomId !== params.chatId && data.isTyping.length > 0 ? (
          <div className="flex items-center text-[14px] text-blue-400">
            <span className="mr-2">
              {data.isTyping.length === 1
                ? `${data.isTyping[0].username} is typing`
                : `${data.isTyping.length} people are typing`}
            </span>
            <div className="flex gap-1 translate-y-0.5">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-typing-dot"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>
          </div>
        ) : (
          <p
            className={`text-[16px] truncate ${
              data.unreadCount > 0 ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            {data.lastMessage
              ? data.lastMessage.length > 26
                ? data.lastMessage?.slice(0, 26) + "..."
                : data.lastMessage
              : "Start messaging..."}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end ml-2 min-w-[60px]">
        <span className="text-[14px] text-gray-400">
          {data.lastActivity && formatDate(data.lastActivity)}
        </span>
        {data.unreadCount > 0 && (
          <span className="bg-blue-600 rounded-full w-5 h-5 flex justify-center items-center text-[12px] mt-1">
            {data.unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ActiveChats;