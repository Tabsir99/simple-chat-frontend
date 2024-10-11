import { IMessage } from "@/types/chatTypes";
import {
  ArrowUpLeft,
} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { ReactionButton, ReactionDisplay } from "./reactions";
import MessageContent from "./messageContent";
import { IUserMiniProfile } from "@/types/userTypes";

export default function MessageContainer({
  message,
  toggleReaction,
  currentUser,
  onDelete,
  onEdit,
  setReplyingTo,
}: {
  message: IMessage;
  toggleReaction: (
    messageId: string,
    emoji: string,
    currentUser: Omit<IUserMiniProfile, "bio"> | null
  ) => void;
  currentUser: Omit<IUserMiniProfile, "bio"> | null;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  setReplyingTo: Dispatch<SetStateAction<IMessage | null>>;
}) {
  const scrollToMessage = (messageId: string | undefined) => {
    const messageEl = document.getElementById(messageId || "");
    const msgPointer = document.getElementById(`pointer-${messageId}`);

    if (messageEl) {
      messageEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      messageEl.style.backgroundColor = "#3c485e";
      if (msgPointer) {
        msgPointer.style.backgroundColor = "#3c485e";
      }

      setTimeout(() => {
        messageEl.removeAttribute("style");
        msgPointer?.style.removeProperty("background-color");
      }, 2000);
    }
  };

  return (
    <div
      className={`flex flex-col ${
        message.type === "outgoing" ? "items-end" : "items-start"
      }`}
    >
      {/* START-------MESSAGE REPLY------START */}
      {message.parentMessage && (
        <div
          onClick={() => scrollToMessage(message.parentMessage?.messageId)}
          className={
            "-mb-2 group block mt-4 pb-5 pt-2 px-4  text-sm cursor-pointer active:scale-95 transition-transform duration-200 bg-gray-800 border-2 border-gray-700 rounded-lg bg-opacity-40 " +
            (message.type === "incoming" ? "translate-x-12": "-translate-x-5")
          }
        >
          <div className="flex items-center mb-1 ">
            <ArrowUpLeft
              size={20}
              className="mr-2 text-gray-400 group-hover:text-gray-200 transition-colors duration-200"
            />
            <span className="font-semibold text-gray-300">
              {message.parentMessage.senderName}
            </span>
          </div>
          <p className="text-gray-400 line-clamp-2">
            {message.parentMessage.content &&
            message.parentMessage.content?.length > 40
              ? message.parentMessage.content.slice(0, 40).trim() + "..."
              : message.parentMessage.content}
          </p>
        </div>
      )}
      {/* END-------MESSAGE REPLY------END */}
      <div
        className={
          "flex max-w-md relative break-words text-pretty group items-start gap-4 pr-3 "
        }
      >
        {message.type === "incoming" ? (
          message.profilePicture ? (
            <div className="w-8 h-8 flex-shrink-0 -mt-2">
              <Image
                src={message.profilePicture}
                alt={message.senderName}
                width={40}
                height={40}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="flex-shrink-0 flex justify-center items-center w-8 h-8 text-[14px] font-bold rounded-full bg-gray-700 uppercase -mt-2">
              {message.senderName.slice(0, 2)}
            </span>
          )
        ) : null}

        <div className={" "}>
          <MessageContent
            message={message}
            onDelete={onDelete}
            onEdit={onEdit}
            setReplyingTo={setReplyingTo}
          />

          {!message.isDeleted && (
            <ReactionButton
              currentUser={currentUser}
              message={message}
              toggleReaction={toggleReaction}
            />
          )}

          {message.reactions.length > 0 && (
            <ReactionDisplay
              currentUser={currentUser}
              message={message}
              toggleReaction={toggleReaction}
            />
          )}
        </div>
      </div>

      {/* Message Receipts */}
      {message.readBy && message.readBy?.length > 0 && (
        <MessageRecipt readBy={message.readBy} />
      )}
    </div>
  );
}

const MessageRecipt = ({
  readBy,
}: {
  readBy: Array<{
    readerName: string;
    profilePicture: string;
    readerId: string;
  }>;
}) => {


  
  return (
    <div className=" flex items-center justify-end mt-3 text-xs text-gray-400 py-2 w-full h-6 px-3">
      <div className="flex items-center gap-0.5">
        <span className="mr-1"> Read by: </span>
        {readBy?.map((reader, index) => (
          <div key={reader.readerId} className="relative">
            {reader.profilePicture ? (
              <img
                src={reader.profilePicture}
                alt={reader.readerName}
                className="w-7 h-7 rounded-full border border-gray-600"
                title={reader.readerName}
              />
            ) : (
              <div
                className="w-7 h-7 p-2  rounded-full bg-gray-600 bg-opacity-20 flex items-center justify-center text-[12px] uppercase text-white border border-gray-700"
                title={reader.readerName}
              >
                {reader.readerName.slice(0, 2)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
