import { IMessage, IMessageReceipt } from "@/types/chatTypes";
import { ArrowUpLeft } from "lucide-react";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction, useEffect, useMemo } from "react";
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
  isSender,
  isCurrentChatGroup,
  allReadRecipts,
}: {
  message: IMessage;
  allReadRecipts: IMessageReceipt[];
  toggleReaction: (
    messageId: string,
    emoji: string,
    currentUser: Omit<IUserMiniProfile, "bio"> | null
  ) => void;
  currentUser: Omit<IUserMiniProfile, "bio"> | null;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  setReplyingTo: Dispatch<SetStateAction<IMessage | null>>;
  isCurrentChatGroup: boolean;
  isSender: boolean;
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
      className={`flex flex-col ${!isSender ? "items-start" : " items-end"}`}
    >
      {/* START-------MESSAGE REPLY------START */}
      {message.parentMessage && (
        <div
          onClick={() => scrollToMessage(message.parentMessage?.messageId)}
          className={
            "-mb-2 group block mt-4 pb-5 pt-2 px-4  text-sm cursor-pointer active:scale-95 transition-transform duration-200 bg-gray-800 border-2 border-gray-700 rounded-lg bg-opacity-40 " +
            (!isSender ? "translate-x-12" : "-translate-x-5")
          }
        >
          <div className="flex items-center mb-1 ">
            <ArrowUpLeft
              size={20}
              className="mr-2 text-gray-400 group-hover:text-gray-200 transition-colors duration-200"
            />
            <span className="font-semibold text-gray-300">
              {message.parentMessage.sender?.username}
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
        {!isSender ? (
          message.sender?.profilePicture ? (
            <div className="w-8 h-8 flex-shrink-0 -mt-2">
              <Image
                src={message.sender.profilePicture}
                alt={message.sender.username}
                width={40}
                height={40}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="flex-shrink-0 flex justify-center items-center w-8 h-8 text-[14px] font-bold rounded-full bg-gray-700 uppercase -mt-2">
              {message.sender?.username.charAt(0)}
            </span>
          )
        ) : null}

        <div className={" "}>
          <MessageContent
            message={message}
            onDelete={onDelete}
            onEdit={onEdit}
            setReplyingTo={setReplyingTo}
            isSender={isSender}
            isCurrentChatPrivate={!isCurrentChatGroup}
          />

          {!message.isDeleted && (
            <ReactionButton
              currentUser={currentUser}
              message={message}
              toggleReaction={toggleReaction}
              isSender={isSender}
            />
          )}

          {message.MessageReaction.length > 0 && (
            <ReactionDisplay
              currentUser={currentUser}
              message={message}
              toggleReaction={toggleReaction}
              isSender={isSender}
            />
          )}
        </div>
      </div>

      {/* Message Receipts */}
      <MessageRecipt
        currentUserId={currentUser?.userId as string}
        allReadRecipts={allReadRecipts}
        messageId={message.messageId}
        messageStatus={message.status}
        isPrivateChat={!isCurrentChatGroup}
        isCurrentUserSender={message.sender?.userId === currentUser?.userId}
      />
    </div>
  );
}

const MessageRecipt = ({
  currentUserId,
  allReadRecipts,
  messageId,
  isPrivateChat,
  isCurrentUserSender,
  messageStatus,
}: {
  allReadRecipts: IMessageReceipt[];
  currentUserId: string;
  messageId: string;
  isPrivateChat: boolean;
  isCurrentUserSender: boolean,
  messageStatus: IMessage["status"],
}) => {
  const readersToShow = useMemo(
    () =>
      allReadRecipts.filter(
        (receipt) =>
          receipt.reader.userId !== currentUserId &&
          receipt.lastReadMessageId === messageId
      ),
    [messageId, allReadRecipts, currentUserId]
  );

  const currentUserR = useMemo(() => allReadRecipts.filter(r => r.reader.userId === currentUserId && r.lastReadMessageId === messageId)[0], [allReadRecipts,currentUserId,messageId])
  
  

  return (
    <div
      className={
        " flex items-center justify-end text-xs text-gray-400  w-full px-3 " +
        (readersToShow.length !== 0 && !isPrivateChat
          ? "py-2  mt-3 h-6"
          : "pt-2")
      }
    >
      {currentUserR && isCurrentUserSender && readersToShow.length === 0 && messageStatus}
      <div className="flex items-center gap-0.5">
        {readersToShow.length > 0 && readersToShow.map((reader, index) => (
          <Fragment key={reader.reader.userId}>
            <span className="mr-1">
              {isPrivateChat?isCurrentUserSender?"seen":"":"Read By:"}
            </span>
            {!isPrivateChat && <Avatar reader={reader.reader} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const Avatar = ({
  reader,
}: {
  reader: { userId: string; profilePicture: string; username: string };
}) => {
  return (
    <div key={reader.userId} className="relative">
      {reader.profilePicture ? (
        <img
          src={reader.profilePicture}
          alt={reader.username}
          className="w-7 h-7 rounded-full border border-gray-600"
          title={reader.username}
        />
      ) : (
        <div
          className="w-7 h-7 p-2  rounded-full bg-gray-600 bg-opacity-20 flex items-center justify-center text-[12px] uppercase text-white border border-gray-700"
          title={reader.username}
        >
          {reader.username.charAt(0)}
        </div>
      )}
    </div>
  );
};
