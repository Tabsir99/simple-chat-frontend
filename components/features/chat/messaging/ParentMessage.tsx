import { ParentMessage as IParentMessage } from "@/types/chatTypes";
import { ArrowUpLeft } from "lucide-react";



interface ParentMessageProps {
    parentMessage: IParentMessage
    isCurrentUserSender: boolean
}
export default function ParentMessage({ parentMessage,isCurrentUserSender }: ParentMessageProps) {
  const scrollToMessage = (messageId: string | undefined) => {
    const messageEl = document.getElementById(messageId || "");
    const msgPointer = document.getElementById(`pointer-${messageId}`);

    if (messageEl) {
      messageEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
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
      onClick={() => scrollToMessage(parentMessage.messageId)}
      className={
        "-mb-2 group block mt-4 pb-5 pt-2 px-4 text-sm cursor-pointer active:scale-95 transition-transform duration-200 bg-gray-800 border-2 border-gray-700 rounded-lg bg-opacity-40 " +
        (!isCurrentUserSender
          ? "translate-x-12"
          : "-translate-x-0")
      }
    >
      <div className="flex items-center mb-1 ">
        <ArrowUpLeft
          size={20}
          className="mr-2 text-gray-400 group-hover:text-gray-200 transition-colors duration-200"
        />
        <span className="font-semibold text-gray-300">
          {parentMessage?.sender?.username}
        </span>
      </div>
      <p className="text-gray-400 line-clamp-2">
        {parentMessage.content &&
        parentMessage.content.length > 40
          ? parentMessage.content.slice(0, 40).trim() + "..."
          : parentMessage.content}
      </p>
    </div>
  );
}
