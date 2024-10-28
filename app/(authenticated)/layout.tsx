"use client";

import { useChatContext } from "@/components/contextProvider/chatContext";
import { useSocket } from "@/components/contextProvider/websocketContext";
import { ProtectedRoute, useAuth } from "@/components/authComps/authcontext";
import { useCallback, useEffect, useRef } from "react";
import { useRecentActivities } from "@/components/contextProvider/recentActivityContext";
import { mutate } from "swr";
import { ecnf } from "@/utils/env";
import {
  AttachmentViewModel,
  IMessage,
  TypingEventData,
} from "@/types/chatTypes";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useParams } from "next/navigation";

type UserStatusEvent = {
  event: "user:status";
  data: {
    friendId: string;
    status: "online" | "offline";
  };
};
type FriendRequestEvent = {
  event: "friend:request";
  data: never;
};
type FriendAcceptedEvent = {
  event: "friend:accepted";
  data: never;
};

type UserEvents = UserStatusEvent | FriendRequestEvent | FriendAcceptedEvent;

type TypingEvent = {
  event: "user:typing";
  data: TypingEventData;
};

type NewMessageEvent = {
  event: "message:new";
  data: {
    chatRoomId: string;
    message: IMessage;
    readBy: string[];
    attachment?: AttachmentViewModel;
  };
};

type MessageReadEvent = {
  event: "message:read";
  data: {
    chatRoomId: string;
    readerId: string;
    messageId: string;
    readerName: string;
    profilePicture: string;
  };
};

type ReactionEvent = {
  event: "message:reaction";
  data: {
    reactions: IMessage["MessageReaction"];
    messageId: string;
    chatRoomId: string;
    username: string;
    reactionType: string;
    isDeleting: boolean;
  };
};
type MessageEvents =
  | TypingEvent
  | NewMessageEvent
  | MessageReadEvent
  | ReactionEvent;
export default function RootAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useSocket();
  const { setActiveChats, updateLastActivity } = useChatContext();
  const { user } = useAuth();

  const { updateActivity } = useRecentActivities();

  const param = useParams();
  const currentChatRef = useRef(param.chatId);

  useEffect(() => {
    currentChatRef.current = param.chatId;
    if (!socket || !param.chatId || !user) return;
    socket.emit("chat:focus", {
      chatRoomId: param.chatId,
      readerName: user.username,
      profilePicture: user.profilePicture,
    });
    setActiveChats((prev) => {
      if (!prev) return prev;
      return prev.map((chat) => {
        if (chat.chatRoomId !== param.chatId) {
          return chat;
        }
        return { ...chat, unreadCount: 0 };
      });
    });
    return () => {
      socket.emit("chat:unfocus", { chatRoomId: param.chatId });
    };
  }, [param, socket, user]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const userEventsHandler = ({ event, data }: UserEvents) => {
      switch (event) {
        case "user:status":
          const { friendId, status } = data;
          let chatId: string | undefined;
          setActiveChats((prevChats) =>
            prevChats
              ? prevChats?.map((chat) => {
                  if (chat.privateChatMemberId === friendId) {
                    chatId = chat.chatRoomId;
                    return {
                      ...chat,
                      roomStatus: status,
                    };
                  }
                  return chat;
                })
              : null
          );

          mutate(
            `${ecnf.apiUrl}/chats/${chatId}/messages`,
            (currentData: AllMessageResponse | undefined) => {
              if (!currentData) return currentData;

              currentData.messages[currentData.messages.length - 1].status =
                "delivered";
              return {
                allReceipts: currentData.allReceipts,
                messages: currentData.messages,
                attachments: currentData.attachments,
              };
            }
          );
          break;
        case "friend:request":
          updateActivity("friendRequests", "increment");
          mutate(`${ecnf.apiUrl}/friendships`);
          break;

        case "friend:accepted":
          updateActivity("acceptedFriendRequests", "increment");
          mutate(`${ecnf.apiUrl}/friendships`);
          mutate(`${ecnf.apiUrl}/chats`);
          break;
        default:
          break;
      }
    };

    const chatEventsHandler = ({
      event,
      data,
    }: {
      event: string;
      data: any;
    }) => {};

    const messageEventHandler = ({ event, data }: MessageEvents) => {
      switch (event) {
        case "user:typing":
          setActiveChats((prevChats) => {
            return prevChats
              ? prevChats.map((chat) => {
                  if (chat.chatRoomId !== data.chatRoomId) {
                    return chat;
                  } else {
                    if (data.isStarting) {
                      return {
                        ...chat,
                        isTyping: [
                          {
                            profilePicture: data.profilePicture,
                            username: data.username,
                            userId: data.userId,
                          },
                        ],
                      };
                    } else {
                      return {
                        ...chat,
                        isTyping: chat.isTyping?.filter(
                          (item) => item.userId !== data.userId
                        ),
                      };
                    }
                  }
                })
              : null;
          });
          break;

        case "message:new":
          updateLastActivity(data.chatRoomId, data.message, data.attachment);
          if (currentChatRef.current !== data.chatRoomId) {
            if (!currentChatRef.current) {
              updateActivity("unseenChats", "increment");
            }

            setActiveChats((prev) => {
              if (!prev) return prev;

              return prev.map((chat) => {
                if (chat.chatRoomId === data.chatRoomId) {
                  return {
                    ...chat,
                    unreadCount: chat.unreadCount + 1,
                  };
                }
                return chat;
              });
            });
          }

          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/messages`,
            (current: AllMessageResponse | undefined) => {
              if (!current) return current;

              const readerSet = new Set(data.readBy);

              const newData: AllMessageResponse = {
                allReceipts: current.allReceipts.map((r) => {
                  if (readerSet.has(r.reader.userId)) {
                    return {
                      reader: r.reader,
                      lastReadMessageId: data.message.messageId,
                    };
                  }
                  return r;
                }),
                messages: [data.message, ...current.messages],
                attachments: data.attachment
                  ? [
                      ...current.attachments,
                      { ...data.attachment, messageId: data.message.messageId },
                    ]
                  : current.attachments,
              };

              return newData;
            },

            { revalidate: false }
          );
          break;

        case "message:read":
          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/messages`,
            (current: AllMessageResponse | undefined) => {
              if (!current) return current;

              const newData: AllMessageResponse = {
                messages: current.messages,
                allReceipts: current.allReceipts.map((r) =>
                  r.reader.userId === data.readerId
                    ? { ...r, lastReadMessageId: data.messageId }
                    : r
                ),
                attachments: current.attachments,
              };

              return newData;
            },
            false
          );
          break;

        case "message:reaction":
          let isSender: boolean = false;
          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/messages`,
            (current: AllMessageResponse | undefined) => {
              if (!current) return current;
              return {
                allReceipts: current.allReceipts,
                messages: current.messages.map((message) => {
                  if (message.messageId !== data.messageId) return message;
                  if (message.sender?.userId === user?.userId) {
                    isSender = true;
                  }
                  return { ...message, MessageReaction: data.reactions };
                }),
                attachments: current.attachments,
              };
            },false
          );

          if (isSender && !data.isDeleting) {
            setActiveChats((prev) => {
              if (!prev) return prev;
              return prev.map((chatHead) => {
                if (chatHead.chatRoomId !== data.chatRoomId) return chatHead;
                return {
                  ...chatHead,
                  unreadCount: chatHead.unreadCount++,
                  lastMessage: {
                    ...chatHead.lastMessage,
                    content: `${data.username} reacted with "${data.reactionType} to your message"`
                  },
                };
              });
            });
          }
          break;
        default:
          break;
      }
    };

    socket.on("userEvent", userEventsHandler);
    socket.on("chatEvent", chatEventsHandler);
    socket.on("messageEvent", messageEventHandler);

    return () => {
      socket.removeAllListeners();
      socket.off("userEvent");
      socket.off("chatEvent");
      socket.off("messageEvent");
    };
  }, [socket]);

  // (async () => {
  // const s = await navigator
  // })()

  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
