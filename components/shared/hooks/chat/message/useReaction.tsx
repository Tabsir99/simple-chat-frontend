import { IMessage, Reactions } from "@/types/chatTypes";
import { AllMessageResponse } from "@/types/responseType";
import { IUserMiniProfile } from "@/types/userTypes";
import { Socket } from "socket.io-client";
import { KeyedMutator } from "swr";


interface UseReactionProps {
    mutate: KeyedMutator<AllMessageResponse>,
    chatId: string,
    socket: Socket | null
    currentUser: IUserMiniProfile | null
}
export default function useReaction({ mutate,socket,chatId,currentUser }: UseReactionProps) {
  const hToggleReaction = (
    message: IMessage,
    userId: string,
    reactionEmoji: string
  ) => {
    const reactionMap = new Map(
      message.MessageReaction.map((reaction) => [reaction.emoji, reaction])
    );

    /**
     * Find if user has an existing reaction on this message
     * Iterates through reaction map to find any emoji the user has already used
     */
    let userCurrentReactionEmoji: string | undefined;
    for (const [emoji, reaction] of reactionMap.entries()) {
      if (reaction.users.includes(userId)) {
        userCurrentReactionEmoji = emoji;
        break;
      }
    }
    return {
      ...message,
      MessageReaction: message.MessageReaction.map((reaction) => {
        /**
         * Handle reaction modifications based on three cases:
         * 1. Remove existing reaction if user clicks same emoji again
         * 2. Add new reaction if:
         *    - User has no existing reaction, or
         *    - User is switching to a different emoji
         * 3. Leave other reactions unchanged
         * @returns {Reactions | null} Modified reaction or null if reaction should be removed
         */

        if (reaction.emoji === userCurrentReactionEmoji) {
          const newUsers = reaction.users.filter((uid) => uid !== userId);
          return newUsers.length > 0
            ? { emoji: reaction.emoji, users: newUsers }
            : null;
        }

        if (
          reaction.emoji === reactionEmoji &&
          (!userCurrentReactionEmoji ||
            userCurrentReactionEmoji !== reactionEmoji)
        ) {
          return {
            emoji: reaction.emoji,
            users: [...reaction.users, userId],
          };
        }

        return reaction;
      })

        // Handle reaction updates and maintain type safety
        .filter((reaction): reaction is Reactions => reaction !== null)

        /**
         * Append new reaction if:
         * 1. The emoji doesn't exist in current reactions AND
         * 2. Either:
         *    - User has no existing reaction
         *    - Or user's existing reaction is different
         * This maintains reaction order consistency in the array
         */
        .concat(
          !reactionMap.has(reactionEmoji) &&
            (!userCurrentReactionEmoji ||
              userCurrentReactionEmoji !== reactionEmoji)
            ? [{ emoji: reactionEmoji, users: [userId] }]
            : []
        ),
    };
  };
  const toggleReaction = (
    messageId: string,
    reactionEmoji: string,
  ) => {
    if (!currentUser?.userId) return;
    const userId = currentUser.userId;
    let modifiedReactions: IMessage["MessageReaction"] = [];

    mutate((currentData) => {
      if (!currentData) return currentData;

      return {
        attachments: currentData.attachments,
        allReceipts: currentData.allReceipts,
        messages: currentData.messages.map((message) => {
          if (message.messageId !== messageId) return message;
          const modifiedMessage = hToggleReaction(
            message,
            userId,
            reactionEmoji
          );
          modifiedReactions = modifiedMessage.MessageReaction;

          return modifiedMessage;
        }),
      };
    }, false);

    socket?.emit("message:reaction", {
      meta: {
        messageId,
        reactionType: reactionEmoji,
        chatRoomId: chatId,
        username: currentUser.username,
      },
      reactions: modifiedReactions,
    });
  };

  return { toggleReaction };
}
