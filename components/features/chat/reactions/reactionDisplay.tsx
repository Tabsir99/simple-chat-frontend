import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { IMessage } from "@/types/chatTypes";
import { Plus } from "lucide-react";

interface ReactionComponentProps {
  message: IMessage;
  toggleReaction: (messageId: string, emoji: string) => void;
}

interface ReactionButtonProps extends ReactionComponentProps {
  handleEmojiPickerToggle: () => void;
}

export const ReactionButton = ({
  message,
  toggleReaction,
  handleEmojiPickerToggle,
}: ReactionButtonProps) => {
  const REACTION_EMOJIS = [
    { emoji: "👍", id: "thumbs_up" },
    { emoji: "❤️", id: "heart" },
    { emoji: "😆", id: "laugh" },
    { emoji: "😮", id: "wow" },
    { emoji: "😢", id: "sad" },
    { emoji: "😠", id: "angry" },
    { emoji: "🎉", id: "party" },
  ];

  const currentUser = useAuth().user;
  return (
    <>
      <div
        className={
          "absolute opacity-0 group-hover:opacity-100 -bottom-8 max-lg:bg-gray-50 -z-10 group-hover:z-30 transition-opacity duration-0 group-hover:duration-300 "
          // (message.sender?.userId !== currentUser?.userId  ? "left-full" : " right-full ")
        }
      >
        <div
          className={`inline-flex items-end bg-gray-800/95 backdrop-blur-sm border border-gray-600/50
            rounded-full p-1.5 shadow-lg transform transition-transform duration-200
        ${
          message.sender?.userId !== currentUser?.userId
            ? ""
            : "flex-row-reverse"
        }
      `}
        >
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji.id}
              onClick={() => toggleReaction(message.messageId, emoji.emoji)}
              className=" relative w-9 flex justify-center items-center h-9 rounded-full bg-none border-none cursor-pointer transition hover:duration-150 duration-75 ease-linear active:scale-90 hover:-translate-y-1 hover:bg-gray-600"
              title={emoji.id}
            >
              <span className="text-xl">{emoji.emoji}</span>
            </button>
          ))}

          <div className="w-px h-6 bg-gray-600/50 mx-0.5" />

          <button
            onClick={() => handleEmojiPickerToggle()}
            className={`
            relative
            w-8 h-8 flex justify-center items-center
            rounded-full bg-transparent
            border-none cursor-pointer
            transition-all duration-200
            hover:bg-gray-600/50
            active:scale-90
          `}
            title="Add custom reaction"
          >
            <Plus className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
    </>
  );
};

// ReactionDisplay Component
export const ReactionDisplay = ({
  message,
  toggleReaction,
}: ReactionComponentProps) => {
  const currentUser = useAuth().user;
  return (
    <>
      {message.MessageReaction.map((reaction, index) => (
        <button
          key={`${reaction.emoji}-${index}`}
          onClick={() => {
            toggleReaction(message.messageId, reaction.emoji);
          }}
          className={`
            flex items-center justify-center gap-1 border border-gray-600 bg-[#313740] w-7 h-7 rounded-full
            hover:bg-gray-700 transition active:scale-90
            animate-[scaleIn_0.2s_ease-out]
            ${
              reaction.users.includes(currentUser?.userId as string)
                ? "ring-1 ring-blue-500"
                : ""
            }
          `}
        >
          <span className="text-[16px]">{reaction.emoji} </span>
          {reaction.users.length > 1 && (
            <span className="text-[12px] text-gray-400">
              {reaction.users.length}
            </span>
          )}
        </button>
      ))}
    </>
  );
};
