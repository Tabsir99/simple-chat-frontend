import {
  InputControls,
  InputSubmitControls,
} from "@/components/features/chat/messaging/messageInput/inputControls";
import { useMessageInput } from "@/components/shared/hooks/chat/message/useMessageInput";
import { AttachmentViewModel } from "@/types/chatTypes";
import { RefObject, useRef, useState } from "react";
import EmojiPicker from "../../reactions/emojiPicker";

interface MessageInputFormProps {
  attachment: AttachmentViewModel | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (files: File) => void;
  clearAttachments: () => void;
  sendMessage: (attachments: any, newMessage: string) => void;
}

const MessageInputForm = ({
  sendMessage,
  attachment,
  clearAttachments,
  fileInputRef,
}: MessageInputFormProps) => {
  const {
    handleFileChange,
    handleFileClick,
    isRecording,
    newMessage,
    setIsRecording,
    setNewMessage,
    toggleRecording,
  } = useMessageInput(fileInputRef);

  const shouldShowSend = newMessage.trim() || attachment ? true : false;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);

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

        <InputControls
          handleFileClick={handleFileClick}
          setShowEmojis={setShowEmojis}
          showEmojis={showEmojis}
        />
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

      <InputSubmitControls
        handleDynamicButtonClick={handleDynamicButtonClick}
        isRecording={isRecording}
        shouldShowSend={shouldShowSend}
      />

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


export default MessageInputForm