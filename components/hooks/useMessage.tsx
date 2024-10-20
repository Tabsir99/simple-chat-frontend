import { useEffect, useRef, useState } from "react";
import { IMessage, Reactions } from "@/types/chatTypes";
import { IUserMiniProfile } from "@/types/userTypes";
import useCustomSWR from "./customSwr";
import { ecnf } from "@/utils/env";
import { useSocket } from "../contextProvider/websocketContext";
import { useChatContext } from "../contextProvider/chatContext";

export function useMessages({ chatId }: { chatId: string | null }) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { updateLastActivity } = useChatContext();
  const { socket } = useSocket();

  const limitRef = useRef(50);

  const { data, mutate } = useCustomSWR<IMessage[]>(
    chatId ? `${ecnf.apiUrl}/chats/${chatId}/messages` : null,
    {
      revalidateIfStale: false,
      // revalidateOnMount: false
    }
  );


  useEffect(() => {
    if (!data) {
      return;
    }
    setMessages(data);
  }, [data]);





  useEffect(() => {
    if (!socket) return;

    // Listen for status updates from server
    const handleStatusUpdate = ({
      messageId,
      status,
      readBy
    }: {
      messageId: string;
      status: IMessage["status"];
      readBy: {
        readerName: string;
        profilePicture: string;
        readerId: string;
      }[];
    }) => {

      mutate((currentData) => {
        if (!currentData?.data) return currentData;

        const newMessageReaders = new Set(
          readBy.map((reader) => reader.readerId)
        );
        const newData = currentData.data?.map<IMessage>((message) => {

          if(message.messageId === messageId){
            return {
              ...message,
              status: status,
              readBy: readBy
            }
          }
          return {...message, readBy: message.readBy.filter(reader => !newMessageReaders.has(reader.readerId))}
        })

        return {
          ...currentData,
          data: newData
        }
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
    const newData = data.map((message) => {
      const newReadBy = message.readBy.filter(
        (user) => user.readerId !== currentUser.userId
      );

      return {
        ...message,
        readBy: newReadBy,
      };
    });
    newData.push(newMessage);

    if (newData.length > limitRef.current) {
      newData.splice(0, newData.length - limitRef.current);
    }
    mutate(
      {
        success: true,
        meta: { timestamp: new Date().toISOString(), version: "1.0" },
        data: newData,
      },
      {
        revalidate: false,
      }
    );

    // Update the active chat heads to render newMessage content and time
    updateLastActivity(chatId as string, newMessage);

    socket?.emit("message:send", {
      chatRoomId: chatId,
      message: newMessage,
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
