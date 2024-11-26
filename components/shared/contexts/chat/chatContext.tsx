"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { AttachmentViewModel, IChatHead, IMessage } from "@/types/chatTypes";
import useCustomSWR from "../../hooks/common/customSwr";
import { ecnf } from "@/utils/constants/env";
import { useAuth } from "../auth/authcontext";
import { useParams } from "next/navigation";

interface ChatContextProps {
  activeChats: IChatHead[] | null;
  setActiveChats: Dispatch<SetStateAction<IChatHead[] | null>>;
  isLoading: boolean;
  updateLastActivity: (
    chatRoomId: string,
    message: IMessage,
    attachment?: AttachmentViewModel
  ) => void;
  getLastMessage: (
    sender: { userId: string | null; username: string | null },
    fileType: AttachmentViewModel["fileType"] | null
  ) => string | undefined;
  getFileCategory: (mimeType: AttachmentViewModel["fileType"]) => any

  getLastMessageCall: (
    callerId: string,
    status: "missed" | "ongoing" | "ended",
    callerName: string
  ) => string;
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

  const user = useAuth().user!;

  const { data, error, isLoading } = useCustomSWR<Array<IChatHead>>(
    user ? `${ecnf.apiUrl}/chats` : null
  );

  const selectedChatId = useParams().chatId;
  const selectedChatIdRef = useRef(useParams().chatId);
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    setActiveChats(data || null);
  }, [data]);

  function getFileCategory(
    mimeType: AttachmentViewModel["fileType"]
  ): "image" | "video" | "audio" | "document" | "other" {
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

    return "other";
  }
  const getLastMessage = (
    sender: { userId: string | null; username: string | null },
    fileType: AttachmentViewModel["fileType"] | null
  ) => {
    if (fileType) {
      const type = getFileCategory(fileType);
      switch (type) {
        case "audio":
          return sender?.userId === user.userId
            ? "You sent an audio"
            : `${sender?.username} sent an audio`;

        case "video":
          return sender?.userId === user.userId
            ? "You sent a video"
            : `${sender?.username} sent a video`;

        case "image":
          return sender?.userId === user.userId
            ? "You sent an image"
            : `${sender?.username} sent an image`;
        case "document":
          return sender?.userId === user.userId
            ? "You sent a document"
            : `${sender?.username} sent a document`;
        default:
          return "";
      }
    }
  };

  const getLastMessageCall = (
    callerId: string,
    status: "missed" | "ongoing" | "ended",
    callerName: string
  ) => {
    const isOutgoing = callerId === user.userId;

    if (status === "missed") {
      return isOutgoing
        ? `${callerName} missed your call`
        : `Missed call from ${callerName}`;
    }
    if (status === "ended") {
      return isOutgoing
        ? `You called ${callerName}`
        : `${callerName} called you`;
    }

    return "Call";
  };

  const updateLastActivity = useCallback(
    (
      chatRoomId: string,
      message: IMessage,
      attachment?: AttachmentViewModel,
      removedAt?: string
    ) => {
      setActiveChats((prevChats) => {
        if (!prevChats) return null;

        const newChats: IChatHead[] = [];
        prevChats.forEach((chat) => {
          if (chat.chatRoomId !== chatRoomId) return newChats.push(chat);

          let callerName: string = "";
          if (message.callInformation) {
            callerName =
              message.callInformation.callerId === user.userId
                ? user.username
                : (chat.oppositeUsername as string);
          }

          const msgContent =
            message.content.trim() ||
            (message.type === "call"
              ? getLastMessageCall(
                  message.callInformation?.callerId as string,
                  message.callInformation?.status!,
                  callerName
                )
              : (getLastMessage(
                  {
                    userId: message.sender?.userId || null,
                    username: message.sender?.username || null,
                  },
                  attachment?.fileType || null
                ) as string));

          newChats.unshift({
            ...chat,
            messageContent: msgContent,
            senderUserId: message.sender?.userId || null,
            senderUsername: message.sender?.username || null,
            lastActivity: message.createdAt,
            removedAt: removedAt ? removedAt : chat.removedAt,
            unreadCount:
              selectedChatIdRef.current === chatRoomId
                ? chat.unreadCount
                : chat.unreadCount + 1,
          });
        });

        return newChats;
      });
    },
    [user]
  );

  return (
    <ChatContext.Provider
      value={{
        activeChats,
        isLoading,
        setActiveChats,
        updateLastActivity,
        getLastMessage,
        getLastMessageCall,
        getFileCategory
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
