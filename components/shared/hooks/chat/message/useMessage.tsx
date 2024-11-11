import { useRef, useState } from "react";
import {
  IMessage,
  AttachmentViewModel,
} from "@/types/chatTypes";
import { IUserMiniProfile } from "@/types/userTypes";
import { ecnf } from "@/utils/env";
import { useChatContext } from "../../../contexts/chat/chatContext";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useAuth } from "../../../contexts/auth/authcontext";
import { useCommunication } from "../../../contexts/communication/communicationContext";
import { useParams } from "next/navigation";
import useReaction from "./useReaction";
import useMessageSocket from "./useMessageSocket";
import { v4 } from "uuid";
import { KeyedMutator } from "swr";

export function useMessages(mutate: KeyedMutator<AllMessageResponse>) {
  

  const chatId = useParams().chatId;
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const currentUser = useAuth().user;

  const divRef = useRef<HTMLDivElement>(null);
  

  const { showNotification, socket } = useCommunication();
  const { updateLastActivity } = useChatContext();
  const { checkAndRefreshToken } = useAuth();
  const { toggleReaction } = useReaction({
    chatId: chatId as string,
    socket,
    mutate,
    currentUser
  });
  useMessageSocket({ socket,mutate });

 

  const addMessage = async (
    newMessage: IMessage,
    currentUser: Omit<IUserMiniProfile, "bio"> | null,
    attachment?: AttachmentViewModel
  ) => {
    if (!currentUser) return;

    let originalData: AllMessageResponse | undefined;
    mutate((currentData) => {
      if (!currentData) return currentData;

      originalData = currentData;
      const newData: AllMessageResponse = {
        attachments: attachment
          ? [
              ...currentData.attachments,
              {
                fileName: attachment.fileName,
                fileSize: attachment.fileSize,
                fileType: attachment.fileType,
                messageId: newMessage.messageId,
                fileUrl: "",
              },
            ]
          : currentData.attachments,
        allReceipts: currentData.allReceipts.map((r) =>
          r.reader.userId === currentUser.userId
            ? {
                ...r,
                lastReadMessageId: newMessage.messageId,
                readStatus: "sending",
              }
            : r
        ),
        messages: [newMessage, ...currentData.messages],
      };

      return newData;
    }, false);

    if (attachment) {
      try {
        await uploadFile(attachment, newMessage.messageId);
      } catch (error) {
        error instanceof Error && showNotification(error.message, "error");
        mutate(originalData);
        console.log(error);
        return;
      }
    }
    // Update the active chat heads to render newMessage content and time
    updateLastActivity(chatId as string, newMessage, attachment);

    const messageToSend: Partial<IMessage> = {
      ...(newMessage.content && { content: newMessage.content }),
      sender: newMessage.sender,
      ...(newMessage.parentMessage && {
        parentMessage: newMessage.parentMessage,
      }),
      messageId: newMessage.messageId,
    };
    socket?.emit("message:send", {
      chatRoomId: chatId,
      message: messageToSend,
      attachment: attachment
        ? {
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            fileSize: attachment.fileSize,
          }
        : undefined,
    });
  };

  async function uploadFile(
    attachment: AttachmentViewModel,
    messageId: string
  ) {
    const token = await checkAndRefreshToken();
    const response = await fetch(`${ecnf.apiUrl}/files`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attachment: {
          fileName: attachment.fileName,
          fileType: attachment.fileType,
          fileSize: attachment.fileSize,
        },
        chatRoomId: chatId,
        messageId: messageId,
      }),
    });
    const data: ApiResponse<{ url: string; path: string }> =
      await response.json();
    if (response.ok) {
      const res = await fetch(data.data?.url as string, {
        method: "PUT",
        headers: {
          "Content-Type": attachment.fileType,
        },
        body: attachment.file,
      });
      if (!res.ok) {
        throw new Error("Failed to send message!");
      }
    } else {
      throw new Error(data.message);
    }
  }

  const editMessage = (messageId: string, newContent: string) => {
    // setMessages((prevMessages) =>
    //   prevMessages.map((msg) => {
    //     if (msg.messageId === messageId) {
    //       return {
    //         ...msg,
    //         content: newContent,
    //         isEdited: true,
    //       };
    //     }
    //     return msg;
    //   })
    // );
  };

  const deleteMessage = (messageId: string) => {
    // setMessages((prevMessages) =>
    //   prevMessages.map((msg) => {
    //     if (msg.messageId === messageId) {
    //       return {
    //         ...msg,
    //         isDeleted: true,
    //       };
    //     }
    //     return msg;
    //   })
    // );
  };

  const scrollToBottom = () => {
    if (!divRef.current) return;
    divRef.current.scrollTop = 0;
  };

  const sendMessage = async (
    attachment: AttachmentViewModel | null,
    newMessage: string
  ) => {
    if (!newMessage.trim() && !attachment)
      return showNotification("Message is too short!");

    const newMsg: IMessage = {
      messageId: v4(),
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      MessageReaction: [],
      status: "sending",
      type: "user",
      sender: {
        profilePicture: currentUser?.profilePicture as string,
        userId: currentUser?.userId as string,
        username: currentUser?.username as string,
      },
      isDeleted: false,
      isEdited: false,

      parentMessage: replyingTo && {
        messageId: replyingTo?.messageId,
        content: replyingTo?.content,
        sender: { username: replyingTo.sender?.username as string },
      },
    };

    addMessage(newMsg, currentUser, attachment || undefined);
    setReplyingTo(null);
    scrollToBottom()
  };
  return {
    sendMessage,
    toggleReaction,
    editMessage,
    deleteMessage,

    replyingTo,
    setReplyingTo,

    divRef
  };
}
