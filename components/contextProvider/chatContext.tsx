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
import { AttachmentViewModel, IChatHead, IMessage } from "@/types/chatTypes";
import useCustomSWR from "../hooks/customSwr";
import { ecnf } from "@/utils/env";
import { useAuth } from "../authComps/authcontext";

interface ChatContextProps {
  activeChats: IChatHead[] | null;
  setActiveChats: Dispatch<SetStateAction<IChatHead[] | null>>;
  isLoading: boolean;
  updateLastActivity: (
    chatRoomId: string,
    message: IMessage,
    attachment?: AttachmentViewModel,
  ) => void;
  getLastMessage: (sender: {userId?: string, username?: string}, fileType?: AttachmentViewModel["fileType"]) => string | undefined
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
  const userId = useAuth().user?.userId

  const { data, error, isLoading } = useCustomSWR<Array<IChatHead>>(
    userId ?`${ecnf.apiUrl}/chats`:null
  );

  useEffect(() => {
    setActiveChats(data || null);
  }, [data]);


function getFileCategory(mimeType: AttachmentViewModel["fileType"]): "image" | "video" | "audio" | "document" | "other" {
    if (mimeType.startsWith("image/")) {
      return "image";
    }
    
    if (mimeType.startsWith("video/")) {
      return "video";
    }
    
    if (mimeType.startsWith("audio/")) {
      return "audio";
    }

    const documentMimeTypes: Set<AttachmentViewModel["fileType"]> = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/html",
      "text/css",
      "text/csv",
    ]);
    
    if (documentMimeTypes.has(mimeType)) {
      return "document";
    }

    return "other"
}
  const getLastMessage = (sender: {userId?: string, username?: string}, fileType?: AttachmentViewModel["fileType"]) => {
    if (fileType) {
      const type = getFileCategory(fileType) 
      switch (type) {
        case "audio":
          return sender?.userId === userId
            ? "You sent an audio"
            : `${sender?.username} sent an audio`;

        case "video":
          return sender?.userId === userId
            ? "You sent a video"
            : `${sender?.username} sent a video`;

        case "image":
          return sender?.userId === userId
            ? "You sent an image"
            : `${sender?.username} sent an image`;
        case "document":
          return sender?.userId === userId
            ? "You sent a document"
            : `${sender?.username} sent a document`;
        default:
          return ""
      }
    }
  };
  const updateLastActivity = (
    chatRoomId: string,
    message: IMessage,
    attachment?: AttachmentViewModel,
  ) => {
    setActiveChats((prevChats) => {
      return prevChats
        ? prevChats.map((chat) => {
            if (chat.chatRoomId !== chatRoomId) return chat;

            return {
              ...chat,
              lastMessage:{
                content: message.content.trim() || (getLastMessage({userId: message.sender?.userId,username: message.sender?.username}, attachment?.fileType) as string),
                sender: {
                  userId: message.sender?.userId,
                  username: message.sender?.userId
                }
              }
                ,
              lastActivity: message.createdAt,
            };
          })
        : null;
    });
  };

  return (
    <ChatContext.Provider
      value={{ activeChats, isLoading, setActiveChats, updateLastActivity,getLastMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};
