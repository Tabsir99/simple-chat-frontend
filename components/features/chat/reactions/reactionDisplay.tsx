import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { IMenu, IMessage } from "@/types/chatTypes";
import { Plus } from "lucide-react";

interface ReactionComponentProps {
  message: IMessage;
  toggleReaction: (messageId: string, emoji: string) => void;
}

interface ReactionButtonProps {
  handleEmojiPickerToggle: () => void;
  menu: IMenu;
  toggleReaction: (messageId: string, emoji: string) => void;
}

export const ReactionButton = ({
  toggleReaction,
  handleEmojiPickerToggle,
  menu,
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
        id="reactionButton"
        style={{ top: menu?.position?.top, left: menu.position?.left }}
        className={`transition-[top,opacity,left] ease-linear fixed top-0 w-[340px]
        ${menu.message?.messageId ? "" : "opacity-0 pointer-events-none duration-200"}`}
      >
        <div
          className={`inline-flex items-end bg-gray-800/95 backdrop-blur-sm border border-gray-600/50
            rounded-full p-1.5 shadow-lg transform transition-transform duration-200
      `}
        >
          {REACTION_EMOJIS.map((emoji, index) => (
            <button
              key={emoji.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!menu.message?.messageId) return;
                toggleReaction(menu.message.messageId, emoji.emoji);
              }}
              className={` relative w-8 flex justify-center items-center h-8 rounded-full bg-none border-none
               cursor-pointer hover:bg-gray-600  hover:-translate-y-1 active:scale-90
               ${
                 menu.message?.messageId
                   ? "  animate-popup transition "
                   : " scale-0"
               }
               `}
              style={{ animationDelay: `${70 * index}ms`}}
              title={emoji.id}
            >
              <span className="text-[22px]">{emoji.emoji}</span>
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
