import { useEffect, useState } from "react";
import { IMessage, Reactions } from "@/types/chatTypes";
import { IUserMiniProfile } from "@/types/userTypes";
import useCustomSWR from "./customSwr";

export function useMessages({ chatId }: { chatId: string | null }) {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { data, error, isLoading } = useCustomSWR<IMessage[]>(
    chatId
      ? `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}/messages`
      : null,
    {
      focusThrottleInterval: 20000,
    }
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    setMessages(data);
  }, [data]);

  const addMessage = (newMessage: IMessage) => {
    setMessages((prevMessages) => {
      const updatedPrevMessages = prevMessages.map((msg) => ({
        ...msg,
        readBy: msg.readBy.filter(
          (reader) => reader.readerId !== newMessage.readBy[0].readerId
        ),
      }));

      return [...updatedPrevMessages, newMessage];
    });
  };

  const toggleReaction = (
    messageId: string,
    reactionEmoji: string,
    currentUser: Omit<IUserMiniProfile, "bio"> | null
  ) => {
    if (!currentUser?.userId) return;
    const userId = currentUser.userId;

    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (message.messageId !== messageId) return message;

        const reactionMap = new Map(
          message.reactions.map((reaction) => [reaction.emoji, reaction])
        );

        let userCurrentReactionEmoji: string | undefined;
        for (const [emoji, reaction] of reactionMap.entries()) {
          if (reaction.users.includes(userId)) {
            userCurrentReactionEmoji = emoji;
            break;
          }
        }

        return {
          ...message,
          reactions: message.reactions
            .map((reaction) => {
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
            .filter((reaction): reaction is Reactions => reaction !== null)
            .concat(
              !reactionMap.has(reactionEmoji) &&
                (!userCurrentReactionEmoji ||
                  userCurrentReactionEmoji !== reactionEmoji)
                ? [{ emoji: reactionEmoji, users: [userId] }]
                : []
            ),
        };
      });
    });
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

  const markAsRead = (messageId: string, currentUser: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (
          msg.messageId === messageId &&
          !msg.readBy?.find((val) => val.readerId === currentUser)
        ) {
          return {
            ...msg,
            readBy: [
              ...(msg.readBy || []),
              {
                profilePicture: "",
                readerName: currentUser,
                readerId: currentUser,
              },
            ],
          };
        }
        return msg;
      })
    );
  };

  return {
    messages,
    addMessage,
    toggleReaction,
    editMessage,
    deleteMessage,
    markAsRead,
  };
}
