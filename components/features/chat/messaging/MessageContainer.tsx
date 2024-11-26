import { AttachmentViewModel, IMenu, IMessage } from "@/types/chatTypes";
import { memo, useState } from "react";
import { ReactionDisplay } from "../reactions/reactionDisplay";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import Attachments from "@/components/features/chat/attachments/attachmentDisplay";
import { formatDate } from "@/utils/utils";
import { BanIcon } from "lucide-react";

export function MessageContainer({
  message,
  attachment,
  isCurrentUserSender,
  selectedMessageId,
  toggleReaction,
  isGroup
}: MessageContainerProps) {
  return (
    <>
      {message.isEdited && (
        <span
          className={`text-[14px] text-gray-300 w-full border ${
            isCurrentUserSender ? "text-right" : "pl-16"
          }`}
        >
          Edited
        </span>
      )}
      <div
        className={
          `${(!isGroup && !isCurrentUserSender)?"pl-3":"gap-2" } flex max-w-[30rem] max-sm:max-w-[300px] relative text-pretty group items-start  break-all hyphens-auto `
        }
      >
        {(isGroup && !isCurrentUserSender) && (
          <Avatar
            avatarName={message.sender?.username as string}
            profilePicture={message.sender?.profilePicture || null}
            className="w-8 h-8 text-[14px]"
          />
        )}

        {message.MessageReaction.length > 0 && (
          <div
            className={`flex flex-wrap items-end z-20 gap-0.5 px-1 h-7 absolute  w-full justify-end 
              ${attachment ? "-bottom-3" : "-bottom-5"}`}
          >
            <ReactionDisplay
              message={message}
              toggleReaction={toggleReaction}
            />
          </div>
        )}

        <div>
          <div
            id={message.messageId}
            className={`relative messageContent px-3 py-2 transition-colors duration-1000 delay-200 text-white rounded-2xl
                ${
                  isCurrentUserSender
                    ? "bg-blue-600 bg-opacity-80 "
                    : " bg-[#2a313e]"
                }
                ${message.isDeleted || (!message.content && "bg-transparent")}
                ${message.isDeleted ? "opacity-60 cursor-not-allowed" : ""}
                ${
                  selectedMessageId === message.messageId && !message.isDeleted
                    ? isCurrentUserSender
                      ? " border-b-[3px] duration-0 border-blue-400"
                      : " border-b-[3px] duration-0 border-gray-500"
                    : ""
                }
              `}
            {...(isCurrentUserSender ? { "data-sender": "true" } : {})}
            {...(message.isDeleted ? { "data-is-deleted": "true" } : {})}
          >
            {/* START-------MESSAGE POINTER------START */}
            {isCurrentUserSender || (
              <div
                id={`pointer-${message.messageId}`}
                className={
                  "absolute w-[25px] h-[25px] transition-colors duration-1000 delay-200 " +
                  " bg-[#2a313e] rotate-[125deg] -left-1 top-3"
                }
                style={{
                  borderRadius: "0 0 100% 100% / 0 0 50% 50%",
                  transformOrigin: "top",
                  clipPath: "polygon(0 0, 70% 0, 50% 100%)",
                }}
              />
            )}
            {/* END-------MESSAGE POINTER------END */}

            {/* Message Content */}

            {!message.isDeleted && attachment?.fileUrl && (
              <Attachments attachments={attachment} />
            )}

            {message.isDeleted ? (
              <p className="italic flex gap-2 items-center leading-tight text-gray-400">
                <BanIcon /> This message was deleted{" "}
              </p>
            ) : (
              <p className="text-[18px] leading-tight max-md:text-[16px]">
                {message.content.trim()}
              </p>
            )}

            {/* Attachments */}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(MessageContainer, (prev, next) => {
  const shouldRerender =
    prev.message.MessageReaction !== next.message.MessageReaction ||
    prev.attachment !== next.attachment ||
    prev.selectedMessageId !== next.selectedMessageId ||
    prev.message.content !== next.message.content;

  return !shouldRerender;
});

interface MessageContainerProps {
  message: IMessage;
  attachment?: AttachmentViewModel;
  isCurrentUserSender: boolean;
  selectedMessageId?: string;
  toggleReaction: (messageId: string, emoji: string) => void;
  isGroup: boolean
}
