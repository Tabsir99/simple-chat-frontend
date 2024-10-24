import { IMessage } from "@/types/chatTypes";
import { IUserMiniProfile } from "@/types/userTypes";

interface ReactionComponentProps {
  message: IMessage;
  currentUser: Omit<IUserMiniProfile, "bio"> | null;
  toggleReaction: (
    messageId: string,
    emoji: string,
    currentUser: Omit<IUserMiniProfile, "bio"> | null
  ) => void;
  isSender: boolean
}

const REACTION_EMOJIS = [
  { id: "thumbs_up", emoji: "👍" },
  { id: "heart", emoji: "❤️" },
  { id: "smile", emoji: "😊" },
  { id: "celebration", emoji: "🎉" },
  { id: "haha", emoji: "😂" },
  { id: "thinking", emoji: "🤔" },
  { id: "angry", emoji: "😠" },
];

// ReactionButton Component
export const ReactionButton = ({
  message,
  currentUser,
  toggleReaction,
  isSender
}: ReactionComponentProps) => {
  return (
    <div
      className={
        "absolute top-1/2 -translate-y-1/2 opacity-0  group-hover:opacity-100 -z-10 group-hover:z-30 mt-2 transition-opacity duration-0 group-hover:duration-300 " +
        (!isSender ? "left-full" : " right-full")
      }
    >
      <div
        className="inline-flex bg-gray-800 border-2 border-gray-600 rounded-full p-1 shadow-lg
"
      >
        {REACTION_EMOJIS.map((emoji) => (
          <button
            onClick={() => {
              toggleReaction(message.messageId, emoji.emoji, currentUser);
            }}
            key={emoji.emoji}
            className=" relative w-9 flex justify-center items-center h-9 rounded-full bg-none border-none cursor-pointer transition hover:duration-150 duration-100 ease-linear active:scale-90 hover:-translate-y-1 hover:bg-gray-600"
            title={emoji.id}
          >
            <span className="text-[24px]">{emoji.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ReactionDisplay Component
export const ReactionDisplay = ({
  message,
  currentUser,
  toggleReaction,
  isSender
}: ReactionComponentProps) => {


  return (
    <div
      className={`flex flex-wrap items-end gap-0.5 px-2 -mt-2 z-10 relative ${
        !isSender ? " justify-start " : "  justify-end"
      }`}
    >
      {message.MessageReaction.map((reaction, index) => (
        <button
          key={`${reaction.emoji}-${index}`}
          onClick={() => {
            toggleReaction(message.messageId, reaction.emoji, currentUser);
          }}
          className={`
            flex items-center justify-center gap-1 border border-gray-600 bg-[#313740] w-8 h-8 rounded-full
            hover:bg-gray-700 transition active:scale-90
            animate-[scaleIn_0.2s_ease-out]
            ${
              reaction.users.includes(currentUser?.userId as string)
                ? "ring-1 ring-blue-500"
                : ""
            }
          `}
          title={reaction.users.join(", ")}
        >
          <span className="text-[16px]">{reaction.emoji} </span>
          {reaction.users.length > 1 && (
            <span className="text-[12px] text-gray-400">
              {reaction.users.length}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
