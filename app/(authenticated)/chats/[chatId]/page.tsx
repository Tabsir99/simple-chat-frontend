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
import { Bell, Info } from "lucide-react";

export default function ChatRoom() {
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);

  const divRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useAuth().user;

  const { activeChats } = useChatContext();
  const { showNotification } = useNotification();

  const params: { chatId: string } = useParams();
  const router = useRouter();
  const [selectedActiveChat, setSelectedActiveChat] =
    useState<IChatHead | null>(null);

  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    toggleReaction,
    readReceipts,
  } = useMessages({ chatId: selectedActiveChat?.chatRoomId || null });

  const scrollToBottom = () => {
    if (!divRef.current) return;

    divRef.current.scrollTop = divRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (divRef.current) {
        divRef.current.style.scrollBehavior = "smooth";
      }
    },1000);
    return () => clearTimeout(t);
  }, [divRef.current]);

  const sendMessage = async (
    e: FormEvent<HTMLFormElement>,
    attachments: Attachment[],
    newMessage: string
  ) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const newMsg: IMessage = {
      messageId: uuid4(),
      content: newMessage,
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
      Attachment: attachments,
    };

    addMessage(newMsg, currentUser);
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
                  if (message.type === "system") {
                    return (
                      <div
                        key={message.messageId}
                        className="flex justify-center items-center mt-3 mb-6 animate-fadeIn"
                      >
                        <div className=" bg-gray-900 bg-opacity-40 rounded-lg px-6 py-3 max-w-[85%] border border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <Bell className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-200">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <MessageContainer
                      key={message.messageId}
                      message={message}
                      currentUser={currentUser}
                      toggleReaction={toggleReaction}
                      onDelete={deleteMessage}
                      onEdit={editMessage}
                      setReplyingTo={setReplyingTo}
                      isSender={message.sender?.userId === currentUser?.userId}
                      isCurrentChatGroup={selectedActiveChat.isGroup}
                      allReadRecipts={readReceipts}
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
                sendMessage={sendMessage}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
                selectedActiveChat={selectedActiveChat}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
