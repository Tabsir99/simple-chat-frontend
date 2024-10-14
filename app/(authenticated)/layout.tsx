"use client";

import { useChatContext } from "@/components/contextProvider/chatContext";
import { useSocket } from "@/components/contextProvider/websocketContext";
import { ProtectedRoute } from "@/components/authComps/authcontext";
import { useEffect } from "react";

export default function RootAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, socket } = useSocket();
  const { setActiveChats } = useChatContext();

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }
    const userEvents = ({ event, data }: { event: string; data: any }) => {
      switch (event) {
        case "user:status":
          const { friendId, status } = data as {
            friendId: string;
            status: "online";
          };
          setActiveChats((prevList) =>
            prevList
              ? prevList?.map((chat) => {
                  if (chat.oppositeUser.userId === friendId) {
                    return {
                      ...chat,
                      oppositeUser: {
                        ...chat.oppositeUser,
                        userStatus: status,
                      },
                    };
                  }
                  return chat;
                })
              : null
          );
          break;

        case "friend:request":
          console.log(event, data)
          break
        default:
          break;
      }
    };

    socket.on("userEvent", userEvents);

    return () => {
      socket.removeListener("userEvent");
      socket.off("userEvent");
    };
  }, [isConnected, socket]);

  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
