import { useEffect, useRef, useState } from "react";
import {
  IMessage,
  IMessageReceipt,
  AttachmentViewModel,
  Reactions,
} from "@/types/chatTypes";
import { IUserMiniProfile } from "@/types/userTypes";
import useCustomSWR from "../common/customSwr";
import { ecnf } from "@/utils/env";
import { useChatContext } from "../../contexts/chat/chatContext";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useAuth } from "../../contexts/auth/authcontext";
import { useCommunication } from "../../contexts/communication/communicationContext";

export function useMessages({ chatId }: { chatId: string | null }) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [readReceipts, setReadReceipts] = useState<IMessageReceipt[]>([]);
  const [attachmentsMap, setAttachmentsMap] = useState<
    Map<string, AttachmentViewModel>
  >(new Map());
  const { showNotification,socket } = useCommunication();

  const { updateLastActivity } = useChatContext();
  const { checkAndRefreshToken } = useAuth();

  const [fetchMore, setFetchMore] = useState({ isLoading: false, hasMore: true })

  const { data, mutate } = useCustomSWR<AllMessageResponse>(
    chatId ? `${ecnf.apiUrl}/chats/${chatId}/messages` : null,
    {
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    if(data.messages.length < 50){
      setFetchMore(prev => ({...prev,hasMore: false}))
    }

    setMessages(data.messages);
    setReadReceipts(data.allReceipts);
    setAttachmentsMap(
      new Map(
        data.attachments.map<[string, AttachmentViewModel]>((a) => [
          a.messageId as string,
          a
        ])
      )
    );

    setFetchMore(prev => ({...prev,isLoading: false}))

  }, [data]);


  useEffect(() => {
    if (!socket) return;

    // Listen for status updates from server
    const handleStatusUpdate = ({
      messageId,
      status,
      readBy,
    }: {
      messageId: string;
      status: "sent" | "delivered" | "failed";
      readBy: string[];
    }) => {
      mutate((currentData) => {
        if (!currentData) return currentData;

        const readerSet = new Set(readBy);

        const newData: AllMessageResponse = {
          attachments: currentData.attachments,
          messages: currentData.messages.map((msg) => {
            return msg.messageId !== messageId
              ? msg
              : { ...msg, status: status };
          }),
          allReceipts:
            status === "failed"
              ? currentData.allReceipts
              : currentData.allReceipts.map((or) => {
                  if (readerSet.has(or.reader.userId)) {
                    return {
                      reader: or.reader,
                      lastReadMessageId: messageId,
                    };
                  }
                  return or;
                }),
        };

        return newData;
      }, false);
    };

    socket.on("message:status", handleStatusUpdate);

    return () => {
      socket.off("message:status");
    };
  }, [socket, mutate]);

  const addMessage = async (
    newMessage: IMessage,
    currentUser: Omit<IUserMiniProfile, "bio"> | null,
    attachment?: AttachmentViewModel
  ) => {
    if (!data || !currentUser) return;

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
                fileUrl: ""
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
      ...(newMessage.content && {content: newMessage.content}),
      sender: newMessage.sender,
      ...(newMessage.parentMessage && {parentMessage: newMessage.parentMessage}),
      messageId: newMessage.messageId
    }
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
  const hToggleReaction = (
    message: IMessage,
    userId: string,
    reactionEmoji: string
  ) => {
    const reactionMap = new Map(
      message.MessageReaction.map((reaction) => [reaction.emoji, reaction])
    );

    /**
     * Find if user has an existing reaction on this message
     * Iterates through reaction map to find any emoji the user has already used
     */
    let userCurrentReactionEmoji: string | undefined;
    for (const [emoji, reaction] of reactionMap.entries()) {
      if (reaction.users.includes(userId)) {
        userCurrentReactionEmoji = emoji;
        break;
      }
    }
    return {
      ...message,
      MessageReaction: message.MessageReaction.map((reaction) => {
        /**
         * Handle reaction modifications based on three cases:
         * 1. Remove existing reaction if user clicks same emoji again
         * 2. Add new reaction if:
         *    - User has no existing reaction, or
         *    - User is switching to a different emoji
         * 3. Leave other reactions unchanged
         * @returns {Reactions | null} Modified reaction or null if reaction should be removed
         */

        if (reaction.emoji === userCurrentReactionEmoji) {
          const newUsers = reaction.users.filter((uid) => uid !== userId);
          return newUsers.length > 0
            ? { emoji: reaction.emoji, users: newUsers }
            : null;
        }

        if (
          reaction.emoji === reactionEmoji &&
          (!userCurrentReactionEmoji ||
            userCurrentReactionEmoji !== reactionEmoji)
        ) {
          return {
            emoji: reaction.emoji,
            users: [...reaction.users, userId],
          };
        }

        return reaction;
      })

        // Handle reaction updates and maintain type safety
        .filter((reaction): reaction is Reactions => reaction !== null)

        /**
         * Append new reaction if:
         * 1. The emoji doesn't exist in current reactions AND
         * 2. Either:
         *    - User has no existing reaction
         *    - Or user's existing reaction is different
         * This maintains reaction order consistency in the array
         */
        .concat(
          !reactionMap.has(reactionEmoji) &&
            (!userCurrentReactionEmoji ||
              userCurrentReactionEmoji !== reactionEmoji)
            ? [{ emoji: reactionEmoji, users: [userId] }]
            : []
        ),
    };
  };
  const toggleReaction = (
    messageId: string,
    reactionEmoji: string,
    currentUser: Omit<IUserMiniProfile, "bio"> | null
  ) => {
    if (!currentUser?.userId) return;
    const userId = currentUser.userId;
    let modifiedReactions: IMessage["MessageReaction"] = [];

    mutate((currentData) => {
      if (!currentData) return currentData;

      return {
        attachments: currentData.attachments,
        allReceipts: currentData.allReceipts,
        messages: currentData.messages.map((message) => {
          if (message.messageId !== messageId) return message;
          const modifiedMessage = hToggleReaction(
            message,
            userId,
            reactionEmoji
          );
          modifiedReactions = modifiedMessage.MessageReaction;

          return modifiedMessage;
        }),
      };
    }, false);

    socket?.emit("message:reaction", {
      meta: {
        messageId,
        reactionType: reactionEmoji,
        chatRoomId: chatId,
        username: currentUser.username,
      },
      reactions: modifiedReactions,
    });
  };

  const editMessage = (messageId: string, newContent: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.messageId === messageId) {
          return {
            ...msg,
            content: newContent,
            isEdited: true,
          };
        }
        return msg;
      })
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.messageId === messageId) {
          return {
            ...msg,
            isDeleted: true,
          };
        }
        return msg;
      })
    );
  };

  return {
    messages,
    readReceipts,
    attachmentsMap,
    fetchMore,
    setFetchMore,
    addMessage,
    toggleReaction,
    editMessage,
    deleteMessage,
  };
}
