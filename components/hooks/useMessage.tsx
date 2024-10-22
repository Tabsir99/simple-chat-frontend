import { useEffect, useRef, useState } from "react";
import { IMessage, IMessageReceipt, Reactions } from "@/types/chatTypes";
import { IUserMiniProfile } from "@/types/userTypes";
import useCustomSWR from "./customSwr";
import { ecnf } from "@/utils/env";
import { useSocket } from "../contextProvider/websocketContext";
import { useChatContext } from "../contextProvider/chatContext";

export function useMessages({ chatId }: { chatId: string | null }) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [readReceipts, setReadReceipts] = useState<IMessageReceipt[]>([]);

  const { updateLastActivity } = useChatContext();
  const { socket } = useSocket();

  const limitRef = useRef(50);

  const { data, mutate } = useCustomSWR<{
    messages: IMessage[];
    allRecipts: IMessageReceipt[];
  }>(chatId ? `${ecnf.apiUrl}/chats/${chatId}/messages` : null, {
    revalidateIfStale: false,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setMessages(data.messages);
    setReadReceipts(data.allRecipts);

  }, [data]);

  useEffect(() => {
    if (!socket) return;

    // Listen for status updates from server
    const handleStatusUpdate = ({
      messageId,
      status,
      readBy,
    }: {
      messageId: string;
      status: "sent" | "delivered" | "failed";
      readBy: string[];
    }) => {
      mutate((currentData) => {
        if (!currentData) return currentData;

        const readerSet = new Set(readBy);

        const newData: {
          messages: IMessage[];
          allRecipts: IMessageReceipt[];
        } = {
          messages: currentData.messages.map((msg) => {
            return msg.messageId !== messageId
              ? msg
              : { ...msg, status: status };
          }),
          allRecipts:
            status === "failed"
              ? currentData.allRecipts
              : currentData.allRecipts.map((or) => {
                  if (readerSet.has(or.reader.userId)) {
                    return {
                      reader: or.reader,
                      lastReadMessageId: messageId,
                    };
                  }
                  return or;
                }),
        };

        return newData;
      }, false);
    };

    socket.on("message:status", handleStatusUpdate);

    return () => {
      socket.off("message:status");
    };
  }, [socket, mutate]);

  const addMessage = async (
    newMessage: IMessage,
    currentUser: Omit<IUserMiniProfile, "bio"> | null
  ) => {
    if (!data || !currentUser) return;

    if (messages.length > limitRef.current) {
      messages.splice(0, messages.length - limitRef.current);
    }

    mutate((currentData) => {
      if (!currentData) return currentData;

      const newData: {
        messages: IMessage[];
        allRecipts: IMessageReceipt[];
      } = {
        allRecipts: currentData.allRecipts.map((r) =>
          r.reader.userId === currentUser.userId
            ? {
                ...r,
                lastReadMessageId: newMessage.messageId,
                readStatus: "sending",
              }
            : r
        ),
        messages: [...currentData.messages, newMessage],
      };

      return newData;
    }, false);
    // Update the active chat heads to render newMessage content and time
    updateLastActivity(chatId as string, newMessage);

    socket?.emit("message:send", {
      chatRoomId: chatId,
      message: newMessage,
    });
  };


  const hToggleReaction = (message: IMessage, userId: string, reactionEmoji: string) => {
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
  }
  const toggleReaction = (
    messageId: string,
    reactionEmoji: string,
    currentUser: Omit<IUserMiniProfile, "bio"> | null
  ) => {
    if (!currentUser?.userId) return;
    const userId = currentUser.userId;
    let modifiedReactions: IMessage["MessageReaction"] = []

    mutate(currentData => {
      if(!currentData) return currentData
      
      return {
        allRecipts: currentData.allRecipts,
        messages: currentData.messages.map(message => {
          if(message.messageId !== messageId) return message
          const modifiedMessage = hToggleReaction(message,userId,reactionEmoji)
          modifiedReactions = modifiedMessage.MessageReaction

          return modifiedMessage
        })
      }
    }, false)

    socket?.emit("message:reaction",{messageId,reactions: modifiedReactions})
  };

  const editMessage = (messageId: string, newContent: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.messageId === messageId) {
          return {
            ...msg,
            content: newContent,
            isEdited: true,
          };
        }
        return msg;
      })
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.messageId === messageId) {
          return {
            ...msg,
            isDeleted: true,
          };
        }
        return msg;
      })
    );
  };

  return {
    messages,
    readReceipts,
    addMessage,
    toggleReaction,
    editMessage,
    deleteMessage,
  };
}
