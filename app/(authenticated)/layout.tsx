"use client";

import { useChatContext } from "@/components/contextProvider/chatContext";
import { useSocket } from "@/components/contextProvider/websocketContext";
import { ProtectedRoute } from "@/components/authComps/authcontext";
import { useEffect } from "react";
import { useRecentActivities } from "@/components/contextProvider/recentActivityContext";
import { mutate } from "swr";
import { ecnf } from "@/utils/env";

export default function RootAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, socket } = useSocket();
  const { setActiveChats } = useChatContext();
  const { incrementTotalNewFriendRequests, incrementUnseenAcceptedFriendRequests } = useRecentActivities()
  

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }
    const userEvents = ({ event, data }: { event: string; data: any }) => {
      console.log(event, data)
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
          incrementTotalNewFriendRequests()
          mutate(`${ecnf.apiUrl}/friendships`)
          break

        case "friend:accepted":
          incrementUnseenAcceptedFriendRequests()
          mutate(`${ecnf.apiUrl}/friendships`)
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
