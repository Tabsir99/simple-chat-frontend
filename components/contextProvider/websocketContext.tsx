'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { Socket, io } from 'socket.io-client'
import { useAuth } from "../authComps/authcontext";

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  lastMessage: any
  sendMessage: (message: any) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  lastMessage: null,
  sendMessage: () => {}
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const socketInstance = io("http://localhost:3001", {
      path: "/socket.io/", // Match the server path
      auth: {
        token: accessToken,
      },
      transports: ["websocket", "polling"], // Fixed typo in polling
      reconnectionAttempts: 5, // Increased for better reliability
      reconnectionDelay: 1500,
      secure: process.env.NODE_ENV === "production",
      autoConnect: true
    });

    // Correct event is 'connect', not 'connection'
    socketInstance.on("connect", () => {
      console.log("Connected to socketio server");
      setIsConnected(true);
    });

    socketInstance.on("connect_error", (error) => {
      console.log("Connection error:", error);
      setIsConnected(false);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
      setIsConnected(false);
    });

    socketInstance.on('message', (message) => {
      console.log('Received message:', message);
      setLastMessage(message);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.removeAllListeners()
      socketInstance.disconnect();
    };
  }, [accessToken]); // Added accessToken to dependency array

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.emit('message', message);
    } else {
      console.warn('Socket is not connected');
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      lastMessage, 
      sendMessage 
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