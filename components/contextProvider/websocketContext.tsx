'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { Socket, io } from 'socket.io-client'
import { useAuth } from "../authComps/authcontext";
import { ecnf } from "@/utils/env";

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
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
          autoConnect: true
        });

        socketInstance.on("connect", () => {
          console.log("Connected to socketio server");
          setSocket(socketInstance);
        });

        socketInstance.on("disconnect", async () => {
          console.log("Disconnected from socketio server");
          setSocket(null);
          
        });


      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initializeSocket();

    return () => {
      if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
      }
    };
  }, [checkAndRefreshToken]);

  return (
    <SocketContext.Provider value={{
      socket,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside a websocket context provider");
  }
  return context;
};