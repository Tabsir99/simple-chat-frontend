import { IMessage } from "@/types/chatTypes";
import { BanIcon, Check, X } from "lucide-react";
import Image from "next/image";
import Attachments from "./attachment";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import MessageMenu from "./messageMenu";
import { formatDate } from "@/utils/utils";

export default function MessageContent({
  message,
  onEdit,
  onDelete,
  setReplyingTo,
  isSender,
  isCurrentChatPrivate
}: {
  message: IMessage;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  setReplyingTo: Dispatch<SetStateAction<IMessage | null>>;
  isSender: boolean;
  isCurrentChatPrivate: boolean
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleEdit = () => {
    onEdit(message.messageId, editedContent?.trim());
    setIsEditing(false);
  };
  return (
    <>
      <div
        id={message.messageId}
        className={`
                relative pl-4 pr-8 py-3 transition-colors duration-1000 delay-200 w-fit
                ${!isSender ? " bg-[#2a313e]" : "bg-blue-600 bg-opacity-80 "}
                text-white  rounded-lg
                ${message.isDeleted ? "opacity-60 cursor-not-allowed" : ""}
              `}
      >
        {/* START-------MESSAGE POINTER------START */}
        {!message.isDeleted && !isSender && (
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

        <MessageMenu
          message={message}
          onDelete={onDelete}
          setIsEditing={setIsEditing}
          setReplyingTo={setReplyingTo}
          isSender={isSender}
        />

        {/* Message Content */}

        {message.isDeleted ? (
          <p className="italic flex gap-2 items-center text-gray-400">
            <BanIcon /> This message was deleted{" "}
          </p>
        ) : isEditing ? (
          <MessageEdit
            editedContent={editedContent}
            handleEdit={handleEdit}
            setEditedContent={setEditedContent}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <p>{message.content.trim()}</p>

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
        {/* {message.attachments && message.attachments.length > 0 && (
          <Attachments attachments={message.attachments} />
        )} */}
      </div>
    </>
  );
}

const MessageEdit = ({
  editedContent,
  setEditedContent,
  setIsEditing,
  handleEdit,
}: {
  editedContent: string;
  setEditedContent: Dispatch<SetStateAction<string>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  handleEdit: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedContent]);

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="bg-gray-700 text-white rounded px-3 py-2 min-h-[100px] resize-none overflow-hidden"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            setIsEditing(false);
          }}
          className="p-2 hover:bg-gray-600 rounded-full transition-colors duration-200"
        >
          <X size={20} />
        </button>
        <button
          onClick={handleEdit}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors duration-200"
        >
          <Check size={20} />
        </button>
      </div>
    </div>
  );
};
