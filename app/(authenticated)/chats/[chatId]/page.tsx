"use client";
import ChatHeader from "@/components/features/chat/IndividualChatHead";
import MessageInput from "@/components/features/chat/messaging/messageInput/messageInput";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageContainer from "@/components/features/chat/messaging/MessageContainer";
import MessageRecipt from "@/components/features/chat/messaging/MessageRecipt";
import TypingIndicator from "@/components/features/chat/messaging/typeIndicator";
import { useMessages } from "@/components/shared/hooks/chat/message/useMessage";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import FullPageLoader from "@/components/shared/ui/organisms/fullpageloader";
import BlockedChatUI from "@/components/features/chat/components/blockedChat";
import useFriendshipActions from "@/components/shared/hooks/userProfile/useFriendshipActions";
import useChatRoom from "@/components/shared/hooks/chat/useChatroom";
import { formatDate } from "@/utils/utils";
import ParentMessage from "@/components/features/chat/messaging/ParentMessage";
import Attachments from "@/components/features/chat/attachments/attachmentDisplay";
import EmojiPicker from "@/components/features/chat/reactions/emojiPicker";
import {
  ReactionButton,
  ReactionDisplay,
} from "@/components/features/chat/reactions/reactionDisplay";

export default function ChatRoom() {
  const currentUser = useAuth().user;

  const {
    selectedActiveChat,
    attachmentsMap,
    fetchMore,
    messages,
    readReceipts,
    mutate,
  } = useChatRoom();

  const { handleFriendshipAction } = useFriendshipActions();

  const {
    sendMessage,
    editMessage,
    deleteMessage,
    toggleReaction,

    replyingTo,
    setReplyingTo,

    divRef,
  } = useMessages(mutate);

  const [emojiPickerMessageId, setEmojiPickerMessageId] = useState<
    string | null
  >(null);

  const [emojiPickerState, setEmojiPickerState] = useState<{
    messageId: string | null;
    position: { top: number; left: number } | null;
  }>({ messageId: null, position: null });

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
                  <TypingIndicator typingUsers={selectedActiveChat.isTyping} />
                )}
              {messages.map((message) => {
                if (message.type === "system") {
                  return (
                    <div
                      key={message.messageId}
                      className="flex justify-center my-2 px-4"
                    >
                      <div className="inline-flex items-center gap-2 max-w-md w-full px-3 py-2 rounded-md bg-transparent border border-gray-700">
                        <span className="flex-grow text-sm text-gray-300">
                          {message.content}
                        </span>

                        <span className="text-xs text-gray-400">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                }

                const isCurrentUserSender =
                  message.sender?.userId === currentUser?.userId;

                return (
                  <div
                    className={`flex flex-col relative rounded-lg w-full ${
                      message.MessageReaction.length > 0 ? "gap-5" : "gap-1.5"
                    }  ${isCurrentUserSender ? "items-end" : "items-start"}`}
                    key={message.messageId}
                  >
                    {message.parentMessage && (
                      <ParentMessage
                        parentMessage={message.parentMessage}
                        isCurrentUserSender={isCurrentUserSender}
                      />
                    )}

                    <MessageContainer
                      attachment={attachmentsMap.get(message.messageId)}
                      message={message}
                      toggleReaction={toggleReaction}
                      onDelete={deleteMessage}
                      onEdit={editMessage}
                      setReplyingTo={setReplyingTo}
                      isCurrentUserSender={isCurrentUserSender}
                      emojiPickerMessageId={emojiPickerState?.messageId}
                    />
                    {!message.isDeleted && (
                      <ReactionButton
                        message={message}
                        toggleReaction={toggleReaction}
                        handleEmojiPickerToggle={() => {
                          setEmojiPickerMessageId((prev) =>
                            prev ? null : message.messageId
                          );
                        }}
                      />
                    )}

                    {message.MessageReaction.length > 0 && (
                      <ReactionDisplay
                        message={message}
                        toggleReaction={toggleReaction}
                      />
                    )}
                    <MessageRecipt
                      allReadRecipts={readReceipts}
                      messageId={message.messageId}
                      messageStatus={
                        selectedActiveChat.isGroup
                          ? "delivered"
                          : message.status
                      }
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
            toggleReaction(emojiPickerMessageId, emoji);
            setEmojiPickerMessageId(null);
          }}
          className={
            "absolute w-80 bottom-16 border-2 border-gray-700 bg-gray-900 z-50 rounded-md py-0 "
          }
        />
      )}
    </section>
  );
}
