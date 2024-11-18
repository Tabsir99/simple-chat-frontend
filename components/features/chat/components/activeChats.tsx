import React, { memo } from "react";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import { IChatHead } from "@/types/chatTypes";
import { useParams } from "next/navigation";
import { useChatContext } from "../../../shared/contexts/chat/chatContext";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";

const ActiveChats = memo(({ data }: { data: IChatHead }) => {
  const params = useParams();
  const { getLastMessage } = useChatContext();

  // Check if this chat is currently active
  const isCurrentChat = params.chatId === data.chatRoomId;

  return (
    <Link
      href={`/chats/${data.chatRoomId}`}
      className={`
        flex items-center w-80 max-lg:w-72 max-lg2:w-full py-3 px-2 rounded-lg 
        transition-colors duration-150 ease-out
        relative
        ${
          isCurrentChat
            ? "bg-[#2c3745] bg-transparent border-l-4 border-blue-500"
            : "bg-[#232b36] bg-transparent hover:bg-[#252f3a]"
        }
      `}
      scroll={false}
    >
      {isCurrentChat && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-l-lg" />
      )}

      <div className="relative w-12 h-12 mr-4">
        <div className="w-full h-ful rounded-full flex justify-center items-center">
          <Avatar
            avatarName={
              data.isGroup
                ? (data.roomName as string)
                : (data.oppositeUsername as string)
            }
            profilePicture={
              data.isGroup ? data.roomImage : data.oppositeProfilePicture
            }
          />
        </div>
        <span
          className={`absolute h-3 w-3 border-2 border-gray-700 rounded-full bottom-1 right-1 
            ${
              data.isGroup || data?.oppositeUserStatus === "online"
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex w-full justify-between mb-1">
          <h2
            className={`text-[18px] capitalize truncate
            text-gray-300
            transition-colors duration-150 ease-out`}
          >
            {data.roomName || data.oppositeUsername}
          </h2>

          <span
            className={`text-[14px] 
            ${isCurrentChat ? "text-gray-300" : "text-gray-400"}
            transition-colors duration-150 ease-out`}
          >
            {data.lastActivity && formatDate(data.lastActivity)}
          </span>
        </div>

        {data.isTyping &&
        data.chatRoomId !== params.chatId &&
        data.isTyping.length > 0 ? (
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
                  style={{ animationDelay: `${index * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p
            className={`text-[16px] truncate pr-6 
              ${
                data.unreadCount > 0 && !data.removedAt
                  ? "text-white font-bold"
                  : "text-gray-400"
              }
              transition-colors duration-150 ease-out`}
          >
            {data.messageContent
              ? data.messageContent
              : getLastMessage(
                  {
                    userId: data.senderUserId,
                    username: data.senderUsername,
                  },
                  data.fileType
                )}
          </p>
        )}
      </div>

      <div className="absolute bottom-4 right-2">
        {data.unreadCount > 0 && !data.removedAt && (
          <span
            className={`rounded-full w-5 h-5 flex justify-center items-center text-[12px]
              ${isCurrentChat ? "bg-blue-700" : "bg-blue-600"}
              transition-colors duration-150 ease-out`}
          >
            {data.unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
});

ActiveChats.displayName = "ActiveChats";

export default ActiveChats;
