import { InputControls } from "@/components/features/chat/messaging/messageInput/inputControls";
import { useMessageInput } from "@/components/shared/hooks/chat/message/useMessageInput";
import { AttachmentViewModel } from "@/types/chatTypes";
import { FormEvent, KeyboardEvent, RefObject, useRef, useState } from "react";
import EmojiPicker from "../../reactions/emojiPicker";
import { Send } from "lucide-react";

interface MessageInputFormProps {
  attachment: AttachmentViewModel | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (files: File) => void;
  clearAttachments: () => void;
  sendMessage: (
    attachments: AttachmentViewModel | null,
    newMessage: string
  ) => void;
}

const MessageInputForm = ({
  sendMessage,
  attachment,
  clearAttachments,
  fileInputRef,
  handleFileSelect,
}: MessageInputFormProps) => {
  const { handleFileClick, newMessage, setNewMessage } =
    useMessageInput(fileInputRef);

  const shouldShowSend = newMessage.trim() || attachment ? true : false;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(attachment, newMessage);
    setNewMessage("");
    clearAttachments();

    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && shouldShowSend) {
      e.preventDefault();
      formRef.current?.requestSubmit();
      return;
    }
  };

  return (
    <div className="relative h-full w-full pl-4 flex max-sm:pl-0 max-sm:pr-1 gap-1 pr-2">
      {/* Main Input Container */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-center flex-1 h-[90%] gap-1 bg-transparent rounded-lg py-1.5 "
      >
        {/* Left Side Buttons */}

        <InputControls
          handleFileClick={handleFileClick}
          setShowEmojis={setShowEmojis}
          showEmojis={showEmojis}
        />
        {/* Text Input */}
        <div className="flex-1 rounded-md relative h-full  ">
          <textarea
            id="msgInput"
            onKeyDown={handleKeyDown}
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
            className=" text-white rounded-md pl-[4.5rem] max-sm:pl-16 pr-4 py-3 text-[18px] focus:outline-none w-full 
          [letter-spacing:0.01rem] max-h-[250px] bg-gray-700 bg-opacity-40 overflow-hidden resize-none absolute translate-y-1
           bottom-0 border-2 border-transparent focus:border-gray-700"
            rows={1}
          />
        </div>

        <button
          type="submit"
          className={`
        inline-flex items-center justify-center
        p-2
        rounded-full
        bg-blue-600 
        text-white
        transition-all duration-200 ease-in-out
        shadow-lg
        hover:bg-blue-700 hover:shadow-xl

        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:scale-100
      `}
        >
          {false ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (!e.target.files) return;
          handleFileSelect(e.target.files[0]);
        }}
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

export default MessageInputForm;
