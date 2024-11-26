import { RefObject, useRef, useState } from "react";
import { IMessage, AttachmentViewModel } from "@/types/chatTypes";
import { IUserMiniProfile } from "@/types/userTypes";
import { ecnf } from "@/utils/constants/env";
import { useChatContext } from "../../../contexts/chat/chatContext";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useAuth } from "../../../contexts/auth/authcontext";
import { useCommunication } from "../../../contexts/communication/communicationContext";
import { useParams } from "next/navigation";
import useReaction from "./useReaction";
import useMessageSocket from "./useMessageSocket";
import { v4 } from "uuid";
import { KeyedMutator } from "swr";

export function useMessages(
  mutate: KeyedMutator<AllMessageResponse>,
  divRef: RefObject<HTMLDivElement>,
  replyingTo: IMessage | null
) {
  const chatId = useParams().chatId;
  const currentUser = useAuth().user;

  const { showNotification, socket } = useCommunication();
  const { updateLastActivity } = useChatContext();
  const { checkAndRefreshToken } = useAuth();
  const { toggleReaction } = useReaction({
    chatId: chatId as string,
    socket,
    mutate,
    currentUser,
  });
  useMessageSocket({ socket, mutate });

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

        // add new message at the start to maintain reverse chronological order
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
        return;
      }
    }
    updateLastActivity(chatId as string, newMessage, attachment);

    // Create a minimal message object for socket transmission
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


  // Function to upload attachment with the message (if any)
  async function uploadFile(
    attachment: AttachmentViewModel,
    messageId: string
  ) {


    const token = await checkAndRefreshToken();

    // Get a signedURL from the server with appropiate permissions to upload the file
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
    mutate((current) => {
      if (!current) return current;
      return {
        allReceipts: current.allReceipts,
        attachments: current.attachments,
        messages: current.messages.map((msg) => {
          if (msg.parentMessage?.messageId === messageId) {
            return {
              ...msg,
              parentMessage: {
                content: newContent,
                messageId: msg.parentMessage.messageId,
                sender: msg.parentMessage.sender,
              },
            };
          }
          if (msg.messageId !== messageId) return msg;
          return {
            ...msg,
            content: newContent,
            isEdited: true,
          };
        }),
      };
    }, false);

    socket?.emit("message:edit", {
      chatRoomId: chatId,
      editedMessage: newContent,
      messageId: messageId,
    });
  };

  const deleteMessage = (messageId: string) => {
    mutate((current) => {
      if (!current) return current;
      return {
        allReceipts: current.allReceipts,
        attachments: current.attachments,
        messages: current.messages.map((msg) => {
          if (msg.parentMessage?.messageId === messageId) {
            return {
              ...msg,
              parentMessage: {
                content: "This message was deleted",
                messageId: msg.parentMessage.messageId,
                sender: msg.parentMessage.sender,
              },
            };
          }
          if (msg.messageId !== messageId) return msg;
          return {
            ...msg,
            content: "",
            isDeleted: true,
          };
        }),
      };
    }, false);

    socket?.emit("message:delete", { messageId, chatRoomId: chatId });
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

      callInformation: null,
    };

    addMessage(newMsg, currentUser, attachment || undefined);
    scrollToBottom();
  };

  return {
    sendMessage,
    toggleReaction,
    editMessage,
    deleteMessage,
  };
}
