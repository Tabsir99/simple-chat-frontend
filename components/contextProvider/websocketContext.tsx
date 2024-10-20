'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { Socket, io } from 'socket.io-client'
import { useAuth } from "../authComps/authcontext";
import { ecnf } from "@/utils/env";

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    const socketInstance = io(ecnf.backendUrl, {
      path: "/socket.io/", // Match the server path
      auth: {
        token: accessToken,
      },
      transports: ["websocket", "polling"], // Fixed typo in polling
      reconnectionAttempts: 5, // Increased for better reliability
      reconnectionDelay: 3000,
      secure: process.env.NODE_ENV === "production",
      autoConnect: true
    });

    // Correct event is 'connect', not 'connection'
    socketInstance.on("connect", () => {
      console.log("Connected to socketio server");
      setIsConnected(true);
    });

    socketInstance.on("connect_error", (error) => {
      setIsConnected(false);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });


    setSocket(socketInstance);
    return () => {
      socketInstance.removeAllListeners()
      socketInstance.disconnect();
    };
  }, [accessToken]);


  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
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