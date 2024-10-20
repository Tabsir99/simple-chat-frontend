"use client";
import ChatHeader from "@/components/chats/chat/IndividualChatHead";
import MessageInput from "@/components/chats/chat/messageInput";
import { useState, useEffect, useRef, FormEvent, useLayoutEffect } from "react";
import MessageContainer from "@/components/chats/messages/messageContainer";
import TypingIndicator from "@/components/chats/messages/typeIndicator";
import { Attachment, IChatHead, IMessage } from "@/types/chatTypes";
import { useMessages } from "@/components/hooks/useMessage";
import { useAuth } from "@/components/authComps/authcontext";
import { useChatContext } from "@/components/contextProvider/chatContext";
import { useParams, useRouter } from "next/navigation";
import FullPageLoader from "@/components/ui/fullpageloader";
import { useNotification } from "@/components/contextProvider/notificationContext";
import { useSocket } from "@/components/contextProvider/websocketContext";
import { v4 as uuid4 } from "uuid";

export default function ChatRoom() {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);

  const divRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useAuth().user;

  const { activeChats } = useChatContext();
  const { showNotification } = useNotification();

  const params: { chatId: string } = useParams();
  const router = useRouter();
  const [selectedActiveChat, setSelectedActiveChat] =
    useState<IChatHead | null>(null);

  const { isConnected, socket } = useSocket();

  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    toggleReaction,
  } = useMessages({ chatId: selectedActiveChat?.chatRoomId || null });

  const scrollToBottom = () => {
    if (!divRef.current) return;

    divRef.current.scrollTop = divRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    if (newMessage.length > 0 && !isTyping) {
      setIsTyping(true);
      if (socket) {
        socket.emit("user:typing", {
          username: currentUser?.username,
          userId: currentUser?.userId,
          profilePicture: currentUser?.profilePicture,
          isStarting: true,

          chatRoomId: selectedActiveChat?.chatRoomId,
        });
      }
    }
    if (newMessage.length === 0 && isTyping) {
      setIsTyping(false);
      if (socket) {
        socket.emit("user:typing", {
          username: currentUser?.username,
          profilePicture: currentUser?.profilePicture,
          userId: currentUser?.userId,
          isStarting: false,

          chatRoomId: selectedActiveChat?.chatRoomId,
        });
      }
    }
  }, [newMessage, isConnected]);

  const sendMessage = async (
    e: FormEvent<Element>,
    attachments: Attachment[]
  ) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const newMsg: IMessage = {
      messageId: uuid4(),
      content: newMessage,
      time: new Date().toISOString(),
      reactions: [],

      sender: {
        profilePicture: currentUser?.profilePicture as string,
        senderName: currentUser?.username as string,
        senderId: currentUser?.userId as string,
      },
      isDeleted: false,
      isEdited: false,

      parentMessage: replyingTo && {
        messageId: replyingTo?.messageId,
        content: replyingTo?.content,
        senderName: replyingTo?.sender.senderName,
      },
      attachments: attachments,
      readBy: [
        {
          readerName: currentUser?.username as string,
          profilePicture: currentUser?.profilePicture as string,
          readerId: currentUser?.userId as string,
        },
      ],
      status: "sending",
    };

    addMessage(newMsg, currentUser);
    setNewMessage("");
    setReplyingTo(null);
  };

  useLayoutEffect(() => {
    if (activeChats) {
      const activeChat = activeChats.find(
        (chat) => chat.chatRoomId === params.chatId
      );
      if (!activeChat) {
        showNotification("Failed to load chat", "error");
        router.push("/chats");
      } else {
        setSelectedActiveChat(activeChat);
      }
    }
  }, [activeChats]);

  return (
    <section className=" w-full flex flex-col border-l-2 border-gray-700 overflow-hidden">
      {!selectedActiveChat ? (
        <FullPageLoader
          loadingPhrases={null}
          className="h-full bg-opacity-40"
        />
      ) : (
        <>
          <ChatHeader selectedActiveChat={selectedActiveChat} />

          <div>
            {/* Main Chat */}
            <div className="flex flex-col overflow-hidden">
              <div
                ref={divRef}

                className="  py-4 px-2 flex flex-col gap-3 overflow-x-hidden overflow-y-auto h-[calc(100vh-8rem)]"
              >
                {messages.map((message) => {
                  
                  return (
                      <MessageContainer
                        key={message.messageId}
                        message={message}
                        currentUser={currentUser}
                        toggleReaction={toggleReaction}
                        onDelete={deleteMessage}
                        onEdit={editMessage}
                        setReplyingTo={setReplyingTo}
                        isSender={message.sender.senderId === currentUser?.userId}
                        isCurrentChatGroup={selectedActiveChat.isGroup}
                      />
                  );
                })}


                {selectedActiveChat.isTyping &&
                  selectedActiveChat.isTyping.length > 0 && (
                    <TypingIndicator
                      typingUsers={selectedActiveChat.isTyping}
                    />
                  )}
              </div>

              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
