'use client'

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { IChatHead } from "@/types/chatTypes";

interface ChatContextProps {
    activeChats: IChatHead[] | null,
    setActiveChats: Dispatch<SetStateAction<IChatHead[] | null>>
}
const ChatContext = createContext<ChatContextProps | null>(null)

export const useChatContext = () => {
    const context = useContext(ChatContext)
    if(!context){
        throw new Error("Chatcontext must be used inside chatprovider")
    }
    return context
}


export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [activeChats, setActiveChats] = useState<IChatHead[] | null>(null);
  
    return (
      <ChatContext.Provider value={{ activeChats, setActiveChats }}>
        {children}
      </ChatContext.Provider>
    );
  };
  