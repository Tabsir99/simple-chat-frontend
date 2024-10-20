"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { IChatHead, IMessage } from "@/types/chatTypes";
import useCustomSWR from "../hooks/customSwr";
import { ecnf } from "@/utils/env";

interface ChatContextProps {
  activeChats: IChatHead[] | null;
  setActiveChats: Dispatch<SetStateAction<IChatHead[] | null>>;
  isLoading: boolean;
  updateLastActivity: (chatRoomId: string, message: IMessage, userId?:string) => void;
}
const ChatContext = createContext<ChatContextProps | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("Chatcontext must be used inside chatprovider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [activeChats, setActiveChats] = useState<IChatHead[] | null>(null);

  const { data, error, isLoading } = useCustomSWR<Array<IChatHead>>(
    `${ecnf.apiUrl}/chats`
  );

  useEffect(() => {
    setActiveChats(data || null);
  }, [data]);

  const updateLastActivity = (chatRoomId: string, message: IMessage, userId?: string) => {
    setActiveChats((prevChats) => {
      return prevChats
        ? prevChats.map((chat) => {
            if (chat.chatRoomId !== chatRoomId) return chat;

            return {
              ...chat,
              lastMessage: message.content,
              lastMessageSenderId: message.sender.senderId,
              lastActivity: message.time,
            };
          })
        : null;
    });
  };

  return (
    <ChatContext.Provider
      value={{ activeChats, isLoading, setActiveChats, updateLastActivity }}
    >
      {children}
    </ChatContext.Provider>
  );
};
