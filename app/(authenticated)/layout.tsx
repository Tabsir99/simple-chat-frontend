"use client";

import { useChatContext } from "@/components/contextProvider/chatContext";
import { useSocket } from "@/components/contextProvider/websocketContext";
import { ProtectedRoute, useAuth } from "@/components/authComps/authcontext";
import { useCallback, useEffect, useRef } from "react";
import { useRecentActivities } from "@/components/contextProvider/recentActivityContext";
import { mutate } from "swr";
import { ecnf } from "@/utils/env";
import { IMessage, TypingEventData } from "@/types/chatTypes";
import { ApiResponse } from "@/types/responseType";
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

type MessageEvents = TypingEvent | NewMessageEvent | MessageReadEvent;
export default function RootAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, socket } = useSocket();
  const { setActiveChats, updateLastActivity } = useChatContext();
  const { user } = useAuth();

  const {
    updateActivity
  } = useRecentActivities();

  const param = useParams();
  const currentChatRef = useRef(param.chatId)

  useEffect(() => {
    currentChatRef.current = param.chatId
    if (!socket || !param.chatId || !user) return;
    socket.emit("chat:focus", {
      chatRoomId: param.chatId,
      readerName: user.username,
      profilePicture: user.profilePicture,
    });
    setActiveChats(prev => {
      if(!prev) return prev
      return prev.map(chat => {
        if(chat.chatRoomId !== param.chatId){
          return chat
        }
        return {...chat,unreadCount: 0}
      })
    })
    return () => {
      socket.emit("chat:unfocus", { chatRoomId: param.chatId });
    };
  }, [param.chatId, socket, user]);

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    const userEventsHandler = ({ event, data }: UserEvents) => {
      switch (event) {
        case "user:status":
          const { friendId, status } = data;
          setActiveChats((prevChats) =>
            prevChats
              ? prevChats?.map((chat) => {
                  if (chat.privateChatMemberId === friendId) {
                    return {
                      ...chat,
                      roomStatus: status,
                    };
                  }
                  return chat;
                })
              : null
          );
          break;
        case "friend:request":
          updateActivity("friendRequests","increment")
          mutate(`${ecnf.apiUrl}/friendships`);
          break;

        case "friend:accepted":
          updateActivity("acceptedFriendRequests","increment")
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
          updateLastActivity(data.chatRoomId, data.message);
          if(currentChatRef.current !== data.chatRoomId){
            
            if(!currentChatRef.current){
              updateActivity("unseenChats","increment")
            }

            setActiveChats(prev => {
              if(!prev) return prev

                return prev.map(chat => {
                  if(chat.chatRoomId === data.chatRoomId){
                    return {
                      ...chat,
                      unreadCount: chat.unreadCount+1
                    }
                  }
                  return chat
                })

            })
          }

          mutate(
            `${ecnf.apiUrl}/chats/${data.chatRoomId}/messages`,
            (current: ApiResponse<IMessage[]> | undefined) => {

              if (!current || !current.data) return current;

              const newMessageReaders = new Set(
                data.message.readBy.map((reader) => reader.readerId)
              );

              console.log(newMessageReaders, "from opposite");
              const newData = current.data.map((message) => {
                return {
                  ...message,
                  readBy: message.readBy.filter(
                    (reader) => !newMessageReaders.has(reader.readerId)
                  ),
                };
              });

              return {
                ...current,
                data: [
                  ...newData,
                  {
                    ...data.message,
                    readBy: data.message.readBy.filter(
                      (reader) => reader.readerId !== user?.userId
                    ),
                  },
                ],
              };
            },
            { revalidate: false }
          );
          break;

        // case "message:read":
        //   mutate(
        //     `${ecnf.apiUrl}/chats/${data.chatRoomId}/messages`,
        //     (current: ApiResponse<IMessage[]> | undefined) => {
        //       if (!current || !current.data) return current;

        //       const newData = current.data.map((msg) => {
        //         if (msg.messageId !== data.messageId)
        //           return {
        //             ...msg,
        //             readBy: msg.readBy.filter(
        //               (reader) => reader.readerId !== data.readerId
        //             ),
        //           };
        //         else {
        //           return {
        //             ...msg,
        //             readBy: [
        //               ...msg.readBy,
        //               {
        //                 readerId: data.readerId,
        //                 profilePicture: data.profilePicture,
        //                 readerName: data.readerName,
        //               },
        //             ],
        //           };
        //         }
        //       });
        //       return {
        //         ...current,
        //         data: newData,
        //       };
        //     }
        //   );
        //   break;
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
  }, [isConnected, socket]);

  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
