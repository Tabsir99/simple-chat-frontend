import { IMessage } from "@/types/chatTypes";
import { Smile, Paperclip, Send, X } from "lucide-react";
import { Dispatch, FormEvent, FormEventHandler, SetStateAction } from "react";
import { useAttachments } from "@/components/hooks/useAttachments";
import Image from "next/image";
import { GrAttachment } from "react-icons/gr";

export default function MessageInput({
  sendMessage,
  newMessage,
  setNewMessage,
  replyingTo = null,
  onCancelReply = () => {},
}: {
  sendMessage: (e: FormEvent<Element>, attachments: any) => void
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
  replyingTo?: IMessage | null;
  onCancelReply?: () => void;
}) {
  const {
    attachments,
    fileInputRef,
    handleFileSelect,
    removeAttachment,
    clearAttachments,
  } = useAttachments();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    
    sendMessage(e, attachments);
    // Clear attachments after sending
    clearAttachments();
  };

  return (
    <div className="px-4 flex flex-col justify-center sticky z-40 bottom-0 items-stretch bg-gray-900 bg-opacity-50 border-t-2 border-gray-700 h-16">
      {replyingTo && (
        <div className={"flex items-center absolute -top-16 left-0 border-2 border-gray-700 z-30 gap-3 px-4 py-3 bg-gray-800 rounded-lg shadow-lg max-w-[90%] transition-all duration-500 "}>
          {/* Profile Picture */}
          {replyingTo.profilePicture ? (
            <img
              src={replyingTo.profilePicture}
              alt={replyingTo.senderName}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          ) : (
            <span className="uppercase font-bold text-xs flex justify-center items-center bg-gray-700 bg-opacity-60 w-10 h-10 rounded-full">
              {" "}
              {replyingTo.senderName.slice(0, 2)}{" "}
            </span>
          )}

          {/* Reply Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-300 mb-1">
              Replying to {replyingTo.senderName}
            </div>

            {/* Message Preview */}
            <div className="text-xs text-gray-400 truncate">
              {replyingTo.content.length > 50
                ? `${replyingTo.content.substring(0, 50)}...`
                : replyingTo.content}
              {replyingTo.isEdited && (
                <span className="text-gray-500 ml-2">(edited)</span>
              )}
            </div>

            {/* Attachments */}
            {replyingTo.attachments?.length ?
              replyingTo.attachments.length > 0 && (
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <GrAttachment size={18} />
                  {replyingTo.attachments.length} Attachment
                  {replyingTo.attachments.length > 1 && "s"}
                </div>
              ):null}
          </div>

          {/* Time */}
          <div className="text-xs text-gray-500 ml-2">{replyingTo.time}</div>

          {/* Close Button */}
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-white ml-2"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="grid grid-cols-3 h-36 items-start bg-[#2b3238] gap-0 -top-36 z-50 rounded-lg w-[58%] pr-2 right-1 overflow-x-hidden absolute  ">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className=" relative group rounded px-1 py-2 flex items-center gap-2 active:scale-95 transition-transform duration-200"
            >
              {attachment.type === "image" && (
                <Image
                  width={200}
                  height={80}
                  src={attachment.url}
                  alt="attachment"
                  className="object-cover rounded"
                />
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-5 sticky bottom-2">
        <button
          type="button"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Smile size={24} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileSelect(Array.from(e.target.files || []))}
          className="hidden"
          multiple
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Paperclip size={24} />
        </button>

        <input
          id="msgInput"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!newMessage.trim() && attachments.length === 0}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
