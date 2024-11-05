import { IChatHead, IMessage, AttachmentViewModel } from "@/types/chatTypes";
import { Smile, Paperclip, Send, X } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  FormEventHandler,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAttachments } from "@/components/hooks/useAttachments";
import Image from "next/image";
import { GrAttachment } from "react-icons/gr";
import { formatDate } from "@/utils/utils";
import { useAuth } from "@/components/authComps/authcontext";
import EmojiPicker from "../messages/emojiPicker";
import FilePreview from "../messages/attachments/attachmentPreview";
import { useCommunication } from "@/components/contextProvider/communicationContext";

export default function MessageInput({
  sendMessage,
  replyingTo = null,
  onCancelReply = () => {},
  selectedActiveChat,
  attachmentsMap,
}: {
  sendMessage: (
    e: FormEvent<HTMLFormElement>,
    attachments: any,
    newMessage: string
  ) => void;
  replyingTo?: IMessage | null;
  onCancelReply?: () => void;
  selectedActiveChat: IChatHead | undefined;
  attachmentsMap: Map<string, AttachmentViewModel>;
}) {
  const { attachment, fileInputRef, handleFileSelect, clearAttachments } =
    useAttachments();

  return (
    <div className="px-4 flex flex-col justify-center sticky z-40 bottom-0 items-stretch bg-gray-900 bg-opacity-50 border-t-2 border-gray-700 h-16">
      {replyingTo && (
        <div
          className={
            "flex items-center absolute -top-16 left-0 border-2 border-gray-700 z-30 gap-3 px-4 py-3 bg-gray-800 rounded-lg shadow-lg max-w-[90%] transition-all duration-500 "
          }
        >
          {/* Profile Picture */}
          {replyingTo.sender?.profilePicture ? (
            <img
              src={replyingTo.sender.profilePicture}
              alt={replyingTo.sender.username}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          ) : (
            <span className="uppercase font-bold text-xs flex justify-center items-center bg-gray-700 bg-opacity-60 w-10 h-10 rounded-full">
              {" "}
              {replyingTo.sender?.username.charAt(0)}{" "}
            </span>
          )}

          {/* Reply Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-300 mb-1">
              Replying to {replyingTo.sender?.username}
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
            {replyingTo && attachmentsMap.has(replyingTo.messageId) ? (
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <GrAttachment size={18} />
                Attachment
              </div>
            ) : null}
          </div>

          {/* Time */}
          <div className="text-xs text-gray-500 ml-2">
            {formatDate(replyingTo.createdAt)}
          </div>

          {/* Close Button */}
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-white ml-2"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {attachment && (
        <FilePreview
          attachment={attachment}
          clearAttachments={clearAttachments}
        />
      )}

      <InputForm
        selectedActiveChat={selectedActiveChat}
        sendMessage={sendMessage}
        attachment={attachment}
        clearAttachments={clearAttachments}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
      />
    </div>
  );
}

const InputForm = ({
  fileInputRef,
  handleFileSelect,
  attachment,
  clearAttachments,
  sendMessage,
  selectedActiveChat,
}: {
  attachment: AttachmentViewModel | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (files: File) => void;
  clearAttachments: () => void;
  sendMessage: (
    e: FormEvent<HTMLFormElement>,
    attachments: any,
    newMessage: string
  ) => void;
  selectedActiveChat: IChatHead | undefined;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { socket } = useCommunication()

  useEffect(() => {
    if (newMessage.length > 0 && !isTyping) {
      setIsTyping(true);
      if (socket) {
        socket.emit("user:typing", {
          username: user?.username,
          userId: user?.userId,
          profilePicture: user?.profilePicture,
          isStarting: true,

          chatRoomId: selectedActiveChat?.chatRoomId,
        });
      }
    }
    if (newMessage.length === 0 && isTyping) {
      setIsTyping(false);
      if (socket) {
        socket.emit("user:typing", {
          username: user?.username,
          profilePicture: user?.profilePicture,
          userId: user?.userId,
          isStarting: false,

          chatRoomId: selectedActiveChat?.chatRoomId,
        });
      }
    }
  }, [newMessage]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          sendMessage(e, attachment, newMessage);
          setNewMessage("");
          clearAttachments();
        }}
        className="flex items-center gap-5 sticky bottom-2"
      >
        <button
          type="button"
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Smile size={24} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            handleFileSelect(Array.from(e.target.files || [])[0])
          }
          className="hidden"
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
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          placeholder="Type a message..."
          ref={inputRef}
          className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 [letter-spacing:0.01rem]"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!newMessage.trim() && !attachment}
        >
          <Send size={20} />
        </button>
      </form>

      {isOpen && (
        <EmojiPicker
          className="absolute -top-[20.5rem] left-1 w-[28rem] "
          onEmojiSelect={(emoji) => {
            if (!inputRef.current) return;

            const start = inputRef.current.selectionStart || 0;

            const newText =
              newMessage.slice(0, start) +
              " " +
              emoji +
              newMessage.slice(start);
            const newPosition = start + emoji.length + 1;
            setNewMessage(newText);

            setTimeout(() => {
              inputRef.current?.focus();
              inputRef.current?.setSelectionRange(newPosition, newPosition);
            }, 0);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
