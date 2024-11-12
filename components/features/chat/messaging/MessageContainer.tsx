import { AttachmentViewModel, IMessage } from "@/types/chatTypes";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  memo,
  useEffect,
  useState,
} from "react";
import { ReactionButton, ReactionDisplay } from "../reactions/reactionDisplay";
import { IUserMiniProfile } from "@/types/userTypes";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import Attachments from "@/components/features/chat/attachments/attachmentDisplay";
import { formatDate } from "@/utils/utils";
import MessageEdit from "@/components/features/chat/messaging/MessageEdit";
import { BanIcon } from "lucide-react";
import MessageMenu from "@/components/features/chat/messaging/messageMenu";
import EmojiPicker from "../reactions/emojiPicker";

export function MessageContainer({
  message,
  toggleReaction,
  onDelete,
  onEdit,
  setReplyingTo,
  attachment,
  isCurrentUserSender,
  emojiPickerMessageId,
}: MessageContainerProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (editedContent: string) => {
    onEdit(message.messageId, editedContent.trim());
    setIsEditing(false);
  };

  return (
    <>
      <div
        className={
          "messageContainer flex max-w-[30rem] relative text-pretty group items-start gap-4 break-all hyphens-auto "
        }
      >
        {isCurrentUserSender || (
          <Avatar
            avatarName={message.sender?.username as string}
            profilePicture={message.sender?.profilePicture || null}
          />
        )}

        <MessageMenu
          message={message}
          onDelete={onDelete}
          setIsEditing={setIsEditing}
          setReplyingTo={setReplyingTo}
        />
        <div>
          <div
            id={message.messageId}
            className={`relative pl-4 pr-7 py-3 transition-colors duration-1000 delay-200 text-white rounded-lg
                ${
                  message.content
                    ? isCurrentUserSender
                      ? "bg-blue-600 bg-opacity-80 "
                      : " bg-[#2a313e]"
                    : "bg-transparent pr-0"
                }
                ${message.isDeleted ? "opacity-60 cursor-not-allowed" : ""}
                ${
                  emojiPickerMessageId === message.messageId
                    ? isCurrentUserSender
                      ? " border-b-[3px] duration-0 border-blue-400"
                      : " border-b-[3px] duration-0 border-gray-500"
                    : ""
                }
              `}
          >
            {/* START-------MESSAGE POINTER------START */}
            {(!message.isDeleted && isCurrentUserSender) || (
              <div
                id={`pointer-${message.messageId}`}
                className={
                  "absolute w-[30px] h-[40px] transition-colors duration-1000 delay-200 " +
                  " bg-[#2a313e] rotate-[110deg] left-1 top-5"
                }
                style={{
                  borderRadius: "0 0 100% 100% / 0 0 50% 50%",
                  transformOrigin: "top",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
            )}
            {/* END-------MESSAGE POINTER------END */}

            {/* Message Content */}

            {message.isDeleted ? (
              <p className="italic flex gap-2 items-center text-gray-400">
                <BanIcon /> This message was deleted{" "}
              </p>
            ) : isEditing ? (
              <MessageEdit
                handleEdit={handleEdit}
                setIsEditing={setIsEditing}
                initmsg={message.content || ""}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[18px] max-md:text-[16px]">
                  {message.content.trim()}
                </p>

                <div className="flex justify-between items-end">
                  {message.isEdited && (
                    <span className="text-[12px] text-gray-400">(edited)</span>
                  )}

                  <span className="text-[14px] text-gray-300">
                    {" "}
                    {formatDate(message.createdAt)}{" "}
                  </span>
                </div>
              </div>
            )}

            {/* Attachments */}
            {!message.isDeleted && attachment && (
              <Attachments attachments={attachment} />
            )}
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
    prev.message.content !== next.message.content;

  return !shouldRerender;
});

interface MessageContainerProps {
  message: IMessage;
  toggleReaction: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  setReplyingTo: Dispatch<SetStateAction<IMessage | null>>;
  attachment?: AttachmentViewModel;
  isCurrentUserSender: boolean;
  emojiPickerMessageId: string | null;
}
