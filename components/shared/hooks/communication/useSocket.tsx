import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ecnf } from "@/utils/constants/env";
import { useAuth } from "../../contexts/auth/authcontext";
import { NotificationType } from "@/types/ChatTypes/CallTypes";

export const useSocketConnection = (
  showNotification: (
    message: string,
    type: NotificationType,
    time: number
  ) => void
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { checkAndRefreshToken } = useAuth();

  useEffect(() => {
    let socketInstance: Socket;
    const initializeSocket = async () => {
      try {
        const token = await checkAndRefreshToken();

        socketInstance = io(ecnf.backendUrl, {
          path: "/socket.io/",
          auth: {
            token: token,
          },
          transports: ["websocket", "polling"],
          reconnectionAttempts: 5,
          reconnectionDelay: 5000,
          secure: process.env.NODE_ENV === "production",
          autoConnect: true,
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
      }

      socketInstance.on("connect", () => {
        console.log("Connected to socketio server");
        setSocket(socketInstance);
      });

      socketInstance.on("closed", () => {
        showNotification(
          "This tab is no longer active because you opened the chat in a new window. To continue your conversation: Switch to your most recently opened tab, or Refresh this page.",
          "warning",
          3600000
        );
        setSocket(null);
      });

      socketInstance.on("disconnect", () => {
        setSocket(null);
      });
    };
    initializeSocket();
  }, []);

  return { socket };
};
