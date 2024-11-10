"use client";
import ChatHeader from "@/components/chats/chat/IndividualChatHead";
import MessageInput from "@/components/features/chat/messaging/messageInput/messageInput";
import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  useLayoutEffect,
  Fragment,
} from "react";
import MessageContainer, {
  MessageRecipt,
} from "@/components/chats/messages/messageContainer";
import TypingIndicator from "@/components/features/chat/messaging/typeIndicator";
import { IChatHead, IMessage, AttachmentViewModel } from "@/types/chatTypes";
import { useMessages } from "@/components/shared/hooks/chat/useMessage";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { useChatContext } from "@/components/shared/contexts/chat/chatContext";
import { useParams, useRouter } from "next/navigation";
import FullPageLoader from "@/components/shared/ui/organisms/fullpageloader";
import { v4 as uuid4 } from "uuid";
import { Bell, Info } from "lucide-react";
import EmojiPicker from "@/components/features/chat/reactions/emojiPicker";
import { ecnf } from "@/utils/env";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { mutate } from "swr";
import BlockedChatUI from "@/components/features/chat/components/blockedChat";
import { useLocalStorage } from "@/components/shared/hooks/storage/useLocalStorage";
import useFriendshipActions from "@/components/shared/hooks/userProfile/useFriendshipActions";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";

export default function ChatRoom() {
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);

  const divRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useAuth().user;

  const { activeChats } = useChatContext();
  const { showNotification } = useCommunication();

  const params: { chatId: string } = useParams();
  const router = useRouter();
  const [selectedActiveChat, setSelectedActiveChat] =
    useState<IChatHead | null>(null);

  const messagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const { checkAndRefreshToken } = useAuth();

  const { saveFile, getFileUrl } = useLocalStorage();

  const { handleFriendshipAction } = useFriendshipActions();
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    toggleReaction,
    readReceipts,
    attachmentsMap,
    fetchMore,
    setFetchMore,
  } = useMessages({ chatId: selectedActiveChat?.chatRoomId || null });

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
      messageId: uuid4(),
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

    scrollToBottom();
  };

  useEffect(() => {
    if (messagesRef.current.length < 1) return;

    const observer = new IntersectionObserver(
      (entry) => {
        entry.forEach(async (el) => {
          if (!el.isIntersecting) return;
          const lastM = messages[messages.length - 1];
          if (el.target.id === lastM.messageId) {
            if (fetchMore.hasMore && !fetchMore.isLoading) {
              setFetchMore((prev) => ({ ...prev, isLoading: true }));

              const token = await checkAndRefreshToken();
              const res = await fetch(
                `${ecnf.apiUrl}/chats/${selectedActiveChat?.chatRoomId}/messages?createdAt=${lastM.createdAt}&messageId=${lastM.messageId}`,
                {
                  method: "GET",
                  cache: "no-cache",
                  headers: { authorization: `Bearer ${token}` },
                }
              );
              if (res.ok) {
                const data: ApiResponse<
                  Omit<AllMessageResponse, "allReceipts">
                > = await res.json();
                if (data.data) {
                  mutate(
                    `${ecnf.apiUrl}/chats/${selectedActiveChat?.chatRoomId}/messages`,
                    (current: AllMessageResponse | undefined) => {
                      if (!current) return current;
                      return {
                        ...current,
                        messages: [
                          ...current.messages,
                          ...(data.data?.messages || []),
                        ],
                      };
                    },
                    false
                  );
                }
              }
            }
          }
          if (
            !attachmentsMap.has(el.target.id) ||
            attachmentsMap.get(el.target.id)?.fileUrl
          )
            return;

          const url = await getFileUrl(
            `${selectedActiveChat?.chatRoomId}-${el.target.id}`
          );
          console.log("url exists,", url);
          if (url) {
            mutate(
              `${ecnf.apiUrl}/chats/${selectedActiveChat?.chatRoomId}/messages`,
              (current: AllMessageResponse | undefined) => {
                if (!current) return current;
                return {
                  allReceipts: current.allReceipts,
                  messages: current.messages,
                  attachments: current.attachments.map((a) =>
                    a.messageId !== el.target.id
                      ? a
                      : { ...a, fileUrl: url as string }
                  ),
                };
              },
              false
            );
            return;
          }
          const token = await checkAndRefreshToken();
          const response = await fetch(
            `${ecnf.apiUrl}/chats/${selectedActiveChat?.chatRoomId}/messages/${
              el.target.id
            }/files?fileName=${attachmentsMap.get(el.target.id)?.fileName}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data: ApiResponse<string> = await response.json();
            if (!data.data) return;
            console.log("url not exists,", data);

            setTimeout(async () => {
              const res = await fetch(data.data as string);
              const file = await res.blob();
              console.log(
                "Fetching and transforming original response -2nd, blob:",
                file
              );
              await saveFile(
                file,
                selectedActiveChat?.chatRoomId as string,
                el.target.id
              );
            }, 2000);

            mutate(
              `${ecnf.apiUrl}/chats/${selectedActiveChat?.chatRoomId}/messages`,
              (current: AllMessageResponse | undefined) => {
                if (!current) return current;
                return {
                  allReceipts: current.allReceipts,
                  messages: current.messages,
                  attachments: current.attachments.map((a) =>
                    a.messageId !== el.target.id
                      ? a
                      : { ...a, fileUrl: data.data as string }
                  ),
                };
              },
              false
            );
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    messagesRef.current.forEach((msg) => {
      if (!msg) return;
      observer.observe(msg);
    });

    return () => {
      observer.disconnect();
    };
  }, [messages.length, attachmentsMap, fetchMore]);

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

  const [emojiPickerMessageId, setEmojiPickerMessageId] = useState<
    string | null
  >(null);
  const [currentMessageSender, setCurrentMessageSender] = useState(false);

  return (
    <section
      className=" w-full grid grid-rows-[75px_1fr_70px] border h-[100dvh] border-l-2 border-gray-800 max-sm:border-none
     overflow-hidden relative  "
    >
      {!selectedActiveChat ? (
        <FullPageLoader
          loadingPhrases={null}
          className="bg-opacity-40"
          height="100dvh"
          width="100%"
        />
      ) : (
        <>
          <ChatHeader selectedActiveChat={selectedActiveChat} />

            {/* Main Chat */}
            <div className="flex flex-col overflow-hidden">
              <div
                ref={divRef}
                className="  py-4 px-2 flex flex-col-reverse gap-3 scroll-smooth overflow-x-hidden overflow-y-auto  
                "
              >
                {selectedActiveChat.isTyping &&
                  selectedActiveChat.isTyping.length > 0 && (
                    <TypingIndicator
                      typingUsers={selectedActiveChat.isTyping}
                    />
                  )}
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
                    <div
                      className={`flex flex-col relative ${
                        message.MessageReaction.length > 0 ? "gap-6" : "gap-1.5"
                      } rounded-lg w-full ${
                        message.sender?.userId !== currentUser?.userId
                          ? "items-start"
                          : "items-end"
                      }`}
                      key={message.messageId}
                    >
                      <MessageContainer
                        attachmentsMap={attachmentsMap}
                        messagesRef={messagesRef}
                        message={message}
                        toggleReaction={toggleReaction}
                        onDelete={deleteMessage}
                        onEdit={editMessage}
                        setReplyingTo={setReplyingTo}
                        emojiPicker={{
                          emojiPickerMessageId: emojiPickerMessageId,
                          handleEmojiPickerToggle() {
                            setEmojiPickerMessageId((prev) =>
                              prev === message.messageId
                                ? null
                                : message.messageId
                            );
                            setCurrentMessageSender(
                              message.sender?.userId === currentUser?.userId
                            );
                          },
                        }}
                      />

                      <MessageRecipt
                        allReadRecipts={readReceipts}
                        messageId={message.messageId}
                        messageStatus={message.status}
                        isPrivateChat={!selectedActiveChat.isGroup}
                        isCurrentUserSender={
                          message.sender?.userId === currentUser?.userId
                        }
                      />
                    </div>
                  );
                })}

                {fetchMore.isLoading && (
                  <FullPageLoader
                    spinnerSize={70}
                    width="100%"
                    className=" bg-transparent"
                    height="fit-content"
                    loadingPhrases={null}
                  />
                )}
              </div>
            </div>
        </>
      )}

      {!selectedActiveChat ? null : selectedActiveChat.blockedUserId ||
        selectedActiveChat.removedAt ? (
        <BlockedChatUI
          currentUserId={currentUser?.userId || ""}
          blockedUserId={selectedActiveChat.blockedUserId || undefined}
          removedAt={
            selectedActiveChat.removedAt
              ? new Date(selectedActiveChat.removedAt)
              : undefined
          }
          onUnblock={async () => {
            await handleFriendshipAction(
              "unblock",
              selectedActiveChat.blockedUserId as string
            );
          }}
        />
      ) : (
        <MessageInput
          sendMessage={sendMessage}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          selectedActiveChat={selectedActiveChat}
          attachmentsMap={attachmentsMap}
        />
      )}
      {emojiPickerMessageId && (
        <EmojiPicker
          onClose={() => {
            setEmojiPickerMessageId(null);
          }}
          onEmojiSelect={(emoji) => {
            toggleReaction(emojiPickerMessageId, emoji, currentUser);
            setEmojiPickerMessageId(null);
          }}
          className={
            "absolute w-80 bottom-16 border-2 border-gray-700 bg-gray-900 z-50 rounded-md py-0 " +
            (currentMessageSender ? "left-0" : "right-2")
          }
        />
      )}
    </section>
  );
}
