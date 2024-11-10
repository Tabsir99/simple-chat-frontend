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
  sendMessage: (attachments: any, newMessage: string) => void;
  replyingTo?: IMessage | null;
  onCancelReply?: () => void;
  selectedActiveChat: IChatHead | undefined;
  attachmentsMap: Map<string, AttachmentViewModel>;
}) {
  const { attachment, fileInputRef, handleFileSelect, clearAttachments } =
    useAttachments();

  return (
    <div
      className="px-0 flex flex-col justify-center items-stretch 
      border-gray-400 relative "
    >
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

      {/* <InputForm
        selectedActiveChat={selectedActiveChat}
        sendMessage={sendMessage}
        attachment={attachment}
        clearAttachments={clearAttachments}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
      /> */}

      <ChatInput
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
  const { socket } = useCommunication();

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
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          sendMessage(e, attachment, newMessage);
          setNewMessage("");
          clearAttachments();
        }}
        className="flex items-center gap-5 max-xs:gap-1"
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

        <div className="flex-1 rounded-md relative h-full self-end py-2 ">
          <textarea
            id="msgInput"
            onChange={(e) => {
              setNewMessage(e.target.value);

              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            value={newMessage}
            placeholder="Type a message..."
            ref={inputRef}
            className=" bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none w-full 
          focus:ring-2 focus:ring-blue-500 [letter-spacing:0.01rem] max-h-[250px] resize-none absolute translate-y-1  bottom-0"
            rows={1}
          />
        </div>

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

import { Mic, Square } from "lucide-react";

interface ChatInputProps {
  attachment: AttachmentViewModel | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (files: File) => void;
  clearAttachments: () => void;
  sendMessage: (attachments: any, newMessage: string) => void;
  selectedActiveChat: IChatHead | undefined;
}

const ChatInput = ({
  sendMessage,
  attachment,
  clearAttachments,
  fileInputRef,
  selectedActiveChat,
}: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { socket } = useCommunication();
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

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

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const shouldShowSend = newMessage.trim() || attachment;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? "Stopping recording" : "Starting recording");
  };

  const handleDynamicButtonClick = () => {
    console.log(shouldShowSend);
    if (shouldShowSend) {
      sendMessage(attachment, newMessage);
      setNewMessage("");
      clearAttachments();
    } else {
      toggleRecording();
    }
  };
  return (
    <div className="relative h-full w-full pl-4 flex max-sm:pl-0 max-sm:pr-1 gap-1 pr-2">
      {/* Main Input Container */}
      <form className="flex items-center flex-1 h-[90%] gap-1 bg-transparent rounded-lg py-1.5 ">
        {/* Left Side Buttons */}
        <div className="flex items-center gap-4 relative z-40 pt-2">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-2 ml-2 absolute hover:bg-gray-700 rounded-full transition-colors"
          >
            <Smile className="w-4 h-4 text-gray-400 hover:text-gray-300" />
          </button>

          <button
            type="button"
            onClick={handleFileClick}
            className="p-2 absolute ml-9 max-sm:ml-8 hover:bg-gray-700 rounded-full transition-colors"
          >
            <Paperclip className="w-4 h-4 text-gray-400 hover:text-gray-300" />
          </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 rounded-md relative h-full  ">
          <textarea
            id="msgInput"
            onChange={(e) => {
              setNewMessage(e.target.value);

              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;

              if (e.target.scrollHeight > 250) {
                e.target.classList.remove("overflow-hidden");
              } else {
                e.target.classList.add("overflow-hidden");
              }
            }}
            onBlur={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            value={newMessage}
            placeholder="Type a message..."
            ref={inputRef}
            className=" text-white rounded-md pl-20 max-sm:pl-16 pr-4 py-2 text-[18px] focus:outline-none w-full 
          [letter-spacing:0.01rem] max-h-[250px] bg-gray-800 overflow-hidden resize-none absolute translate-y-1 bottom-0 border border-gray-700"
            rows={1}
          />
        </div>

        {/* Right Side Buttons */}
      </form>
      <div className="relative self-center">
        <button
          type={shouldShowSend ? "submit" : "button"}
          onClick={() => {
            handleDynamicButtonClick();
          }}
          className={`p-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 ${
            shouldShowSend
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              : isRecording
              ? "bg-red-500/20 text-red-500 animate-pulse"
              : "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="relative w-5 h-5">
            <div
              className={`absolute inset-0 transition-all duration-200 transform ${
                shouldShowSend ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            >
              <Send className="w-5 h-5" />
            </div>
            <div
              className={`absolute inset-0 transition-all duration-200 transform ${
                !shouldShowSend && !isRecording
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50"
              }`}
            >
              <Mic className="w-5 h-5" />
            </div>
            <div
              className={`absolute inset-0 transition-all duration-200 transform ${
                isRecording ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            >
              <Square className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*"
      />

      {showEmojis && (
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
          onClose={() => setShowEmojis(false)}
        />
      )}
    </div>
  );
};
