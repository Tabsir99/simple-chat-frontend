"use client";
import ChatHeader from "@/components/features/chat/IndividualChatHead";
import MessageInput from "@/components/features/chat/messaging/messageInput/messageInput";
import { useRef } from "react";
import MessageContainer from "@/components/features/chat/messaging/MessageContainer";
import MessageRecipt from "@/components/features/chat/messaging/MessageRecipt";
import TypingIndicator from "@/components/features/chat/messaging/typeIndicator";
import { useMessages } from "@/components/shared/hooks/chat/message/useMessage";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import FullPageLoader from "@/components/shared/ui/organisms/fullpageloader";
import BlockedChatUI from "@/components/features/chat/components/blockedChat";
import useFriendshipActions from "@/components/shared/hooks/userProfile/useFriendshipActions";
import useChatRoom from "@/components/shared/hooks/chat/useChatroom";
import ParentMessage from "@/components/features/chat/messaging/ParentMessage";
import EmojiPicker from "@/components/features/chat/reactions/emojiPicker";
import {
  ReactionButton,
} from "@/components/features/chat/reactions/reactionDisplay";
import MessageMenu from "@/components/features/chat/messaging/messageMenu";
import useMenu from "@/components/shared/hooks/chat/useMenu";
import MessageEditModal from "@/components/features/chat/messaging/MessageEdit";

export default function ChatRoom() {
  const currentUser = useAuth().user;
  const divRef = useRef<HTMLDivElement>(null);

  const {
    selectedActiveChat,
    attachmentsMap,
    fetchMore,
    messages,
    readReceipts,
    mutate,
    handleReply,
    replyingTo,
  } = useChatRoom();

  const { handleFriendshipAction } = useFriendshipActions();

  const { sendMessage, editMessage, deleteMessage, toggleReaction } =
    useMessages(mutate, divRef, replyingTo);

  const {
    menu,
    closeMenu,
    handleEmojiPickerToggle,
    isEditing,
    toggleMessageEdit,
  } = useMenu(divRef);

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
          <div className="flex flex-col overflow-hidden ">
            <div
              ref={divRef}
              className=" py-4 px-2 flex select-none h-full flex-col-reverse gap-0 scroll-smooth overflow-x-hidden overflow-y-auto  
                "
            >
              {selectedActiveChat.isTyping &&
                selectedActiveChat.isTyping.length > 0 && (
                  <TypingIndicator typingUsers={selectedActiveChat.isTyping} />
                )}
              {messages.map((message, index) => {
                if (message.type === "system") {
                  return (
                    <div
                      key={message.messageId}
                      className="flex justify-center my-0 leading-none text-center items-center gap-2 
                      w-full p-3 rounded-md bg-transparent text-[16px] text-gray-400 "
                    >
                      {message.content}
                    </div>
                  );
                }

                const isCurrentUserSender =
                  message.sender?.userId === currentUser?.userId;

                return (
                  <div
                    className={`flex flex-col relative justify-center  w-full ${
                      message.MessageReaction.length > 0 ? "gap-6" : "gap-0"
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
                      isCurrentUserSender={isCurrentUserSender}
                      selectedMessageId={menu.message?.messageId}
                      toggleReaction={toggleReaction}
                      isGroup={selectedActiveChat.isGroup}
                    />

                    <MessageRecipt
                      allReadRecipts={readReceipts}
                      messageId={message.messageId}
                      messageStatus={
                        selectedActiveChat.isGroup
                          ? "delivered"
                          : message.status
                      }
                      isPrivateChat={!selectedActiveChat.isGroup}
                      isCurrentUserSender={isCurrentUserSender}
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

              {menu.message?.isDeleted || (
                <ReactionButton
                  toggleReaction={(msgId, emoji) => {
                    toggleReaction(msgId, emoji);
                    closeMenu();
                  }}
                  handleEmojiPickerToggle={handleEmojiPickerToggle}
                  menu={menu}
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
          onCancelReply={() => handleReply(null)}
          selectedActiveChat={selectedActiveChat}
          attachmentsMap={attachmentsMap}
        />
      )}

      <EmojiPicker
        id="emojiPicker"
        onClose={handleEmojiPickerToggle}
        onEmojiSelect={(emoji) => {
          if (menu.message) toggleReaction(menu.message.messageId, emoji);
          closeMenu();
        }}
        className={`absolute w-full bottom-0 z-[60] border-2 border-gray-700 bg-gray-900 rounded-md py-0
           ${
             menu.showEmojiPicker ? "translate-y-0" : "translate-y-full"
           } transition duration-200
            `}
      />

      {menu.message?.isDeleted || (
        <MessageMenu
          onDelete={deleteMessage}
          toggleMessageEdit={(initMsg: string) => toggleMessageEdit(initMsg)}
          setReplyingTo={handleReply}
          handleToggleMenu={() => {
            closeMenu();
          }}
          menu={menu}
        />
      )}

      {isEditing && (
        <MessageEditModal
          initialMessage={isEditing}
          handleEdit={(editedContent) => {
            if (menu.message && isEditing.trim() !== editedContent.trim())
              editMessage(menu.message.messageId, editedContent);

            closeMenu();
          }}
          onClose={() => toggleMessageEdit("")}
        />
      )}
    </section>
  );
}
