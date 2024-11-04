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
  IChatHead,
  IMessage,
  TypingEventData,
} from "@/types/chatTypes";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useParams, useRouter } from "next/navigation";
import { ChatRoomMember } from "@/types/chatTypes";
import { Friends } from "@/types/userTypes";

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
type FriendBlockedEvent = {
  event: "friend:blocked";
  data: { chatRoomId: string; blockedUserId: string };
};

type UserEvents =
  | UserStatusEvent
  | FriendRequestEvent
  | FriendAcceptedEvent
  | FriendBlockedEvent;

type TypingEvent = {
  event: "user:typing";
  data: TypingEventData;
};

type NewMessageEvent = {
  event: "message:new";
  data: {
    chatRoomId: string;
    message: {
      parentMessage?: IMessage["parentMessage"];
      content?: string;
      messageId: string;
      createdAt: string;
      sender?: IMessage["sender"];
      type?: IMessage["type"];
    };
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

type MemberRoleUpdate = {
  event: "role:update";
  data: {
    userId: string;
    chatRoomId: string;
    userRole: "admin" | "member";
  };
};

type MemberNicknameUpdate = {
  event: "nickname:update";
  data: {
    userId: string;
    chatRoomId: string;
    nickname: string;
  };
};

type MemberAddEvent = {
  event: "member:add";
  data: {
    chatRoomId: string;
    users: string[]
  };
};

type MemberRemoveEvent = {
  event: "member:remove";
  data: {
    userId: string;
    chatRoomId: string;
  };
};

type ChatEvents =
  | MemberRoleUpdate
  | MemberNicknameUpdate
  | MemberAddEvent
  | MemberRemoveEvent;
export default function RootAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useSocket();
  const { setActiveChats, updateLastActivity } = useChatContext();
  const { user } = useAuth();

  const { updateActivity } = useRecentActivities();
  const router = useRouter();

  const param = useParams();
  const currentChatRef = useRef<string>(param.chatId as string);

  useEffect(() => {
    currentChatRef.current = param.chatId as string;
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
                  if (chat.oppositeUserId === friendId) {
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
            },
            false
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
        case "friend:blocked":
          mutate(`${ecnf.apiUrl}/chats`, (current: IChatHead[] | undefined) => {
            if (!current) return current;
            return current.map((chatHead) => {
              if (chatHead.chatRoomId !== data.chatRoomId) return chatHead;
              return {
                ...chatHead,
                blockedUserId: data.blockedUserId,
              };
            });
          });
        default:
          break;
      }
    };

    const chatEventsHandler = ({ event, data }: ChatEvents) => {
      switch (event) {
        case "role:update":
          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/members`,
            (current: ChatRoomMember[] | undefined) => {
              if (!current) return current;
              return current.map((mem) => {
                if (mem.userId !== data.userId) return mem;
                return {
                  ...mem,
                  isAdmin: data.userRole === "admin",
                };
              });
            },false
          );
          break;

        case "nickname:update":
          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/members`,
            (current: ChatRoomMember[] | undefined) => {
              if (!current) return current;
              return current.map((mem) => {
                if (mem.userId !== data.userId) return mem;
                return {
                  ...mem,
                  nickName: data.nickname,
                };
              });
            },
            false
          );
          break;

        case "member:add":
          console.log("Whats up sucker", data)

          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/members`);

          setActiveChats((prev) => {
            if (!prev) return prev;
            return prev.map((c) => {
              if (
                c.chatRoomId !== data.chatRoomId ||
                !data.users.includes(user?.userId || "")
              )
                return c;
              return {
                ...c,
                removedAt: null,
              };
            });
          });
          
          break;

        case "member:remove":
          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/members`,
            (current: ChatRoomMember[] | undefined) => {
              if (!current) return current;
              return current.filter((mem) => mem.userId !== data.userId);
            },
            false
          );
          setActiveChats((prev) => {
            if (!prev) return prev;
            return prev.map((c) => {
              if (
                c.chatRoomId !== data.chatRoomId ||
                user?.userId !== data.userId
              )
                return c;
              return {
                ...c,
                removedAt: new Date().toISOString(),
                unreadCount: 0
              };
            });
          });
          router.push("/chats");
        default:
          break;
      }
    };

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
          const newMessage: IMessage = {
            content: data.message.content || "",
            createdAt: data.message.createdAt,
            messageId: data.message.messageId,
            sender: data.message.sender || null,
            type: data.message.type || "user",
            status: "delivered",
            isDeleted: false,
            isEdited: false,
            parentMessage: data.message.parentMessage || null,
            MessageReaction: [],
          };
        
          updateLastActivity(
            data.chatRoomId,
            newMessage,
            data.attachment,
          );
          if (!currentChatRef.current) {
            updateActivity("unseenChats", "increment");
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
                messages: [newMessage, ...current.messages],
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
            },
            false
          );

          if (isSender && !data.isDeleting) {
            setActiveChats((prev) => {
              if (!prev) return prev;
              return prev.map((chatHead) => {
                if (chatHead.chatRoomId !== data.chatRoomId) return chatHead;
                return {
                  ...chatHead,
                  unreadCount: chatHead.unreadCount++,
                  messageContent: `${data.username} reacted with "${data.reactionType} to your message"`,
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
