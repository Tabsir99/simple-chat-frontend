import { IChatHead } from "@/types/chatTypes";

import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/utils";

export default function ActiveChats({ data }: { data: IChatHead }) {
  
  return (
    <Link
      key={data.chatRoomId}
      href={`/chats/${data.chatRoomId}`}
      className={`flex items-center justify-center w-80 py-3 hover:cursor-pointer px-4 bg-[#252a32] rounded-lg transition-all duration-300 ease-in-out hover:bg-[#272e38] `}
    >
      <div className="avatar w-12 h-12 border border-gray-600 bg-opacity-20 flex justify-center items-center bg-[#222b35] rounded-full mr-4 relative">
        {data.oppositeUser.profilePicture ? (
          <Image src={data.oppositeUser.profilePicture} alt="Profile pic" />
        ) : (
          <span className=" uppercase text-base text-gray-300 flex justify-center items-center">
            {" "}
            {data.roomName.slice(0, 2)}{" "}
          </span>
        )}
        <span
          className={
            " h-3 w-3 border-2 border-gray-700 rounded-full block absolute uppercase bottom-0.5 right-0.5 " +
            (data.oppositeUser.userStatus === "offline" && !data.isGroup
              ? "bg-gray-500"
              : "bg-green-500")
          }
        />
      </div>
      <div className="flex-1 space-y-1">
        <h2 className="text-[18px] font-bold text-gray-300 capitalize">{data.roomName}</h2>
        <p className={" text-[16px] truncate "+(data.unreadCount > 0?"text-white font-bold":"text-gray-400")}>
          {data.lastMessage
            ? data.lastMessage.length > 26
              ? data.lastMessage?.slice(0, 26) + "..."
              : data.lastMessage
            : "Start messaging..."}
        </p>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <span className="text-[14px] text-gray-400">
          {" "}
          {data.lastActivity && formatDate(data.lastActivity)}
        </span>
        {data.unreadCount > 0 && (
          <span className="bg-blue-600 rounded-full w-4 h-4 flex justify-center items-center text-[14px]">
            {" "}
            {data.unreadCount}{" "}
          </span>
        )}
      </div>
    </Link>
  );
}
