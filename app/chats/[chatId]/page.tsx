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

export default function ChatRoom() {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useAuth().user;
  const { activeChats } = useChatContext();
  const params: { chatId: string } = useParams();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [selectedActiveChat, setSelectedActiveChat] =
    useState<IChatHead | null>(null);

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
  }, [messages.length]);

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const sendMessage = async (
    e: FormEvent<Element>,
    attachments: Attachment[]
  ) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const newMsg: IMessage = {
      messageId: String(messages.length + 1),
      content: newMessage,
      type: "outgoing",
      time: new Date().toISOString(),
      reactions: [],
      senderName: currentUser?.username as string,
      profilePicture: "",
      parentMessage: replyingTo && {
        messageId: replyingTo?.messageId,
        content: replyingTo?.content,
        senderName: replyingTo?.senderName,
      },
      attachments: attachments,
      readBy: [
        {
          readerName: currentUser?.username as string,
          profilePicture: currentUser?.profilePicture as string,
          readerId: currentUser?.userId as string,
        },
      ],
    };

    addMessage(newMsg);
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
    <section className="bg-[#212830] w-full h-screen flex flex-col border-l-2 border-gray-700">
      {!selectedActiveChat ? (
        <FullPageLoader
          loadingPhrases={null}
          className="h-full bg-opacity-40"
        />
      ) : (
        <>
          <ChatHeader selectedActiveChat={selectedActiveChat} />

          <div className="flex flex-1">
            {/* Main Chat */}
            <div className="flex-1 flex flex-col">
              <div
                ref={divRef}
                className="  py-4 px-2 flex flex-col gap-3 overflow-y-scroll overflow-x-hidden h-[calc(100vh-8rem)] scroll-smooth"
              >
                {messages.map((message) => (
                  <>
                    <MessageContainer
                      key={message.messageId}
                      message={message}
                      currentUser={currentUser}
                      toggleReaction={toggleReaction}
                      onDelete={deleteMessage}
                      onEdit={editMessage}
                      setReplyingTo={setReplyingTo}
                    />
                  </>
                ))}

                {isTyping && <TypingIndicator profilePicture={""} username={"ta"} />}
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
