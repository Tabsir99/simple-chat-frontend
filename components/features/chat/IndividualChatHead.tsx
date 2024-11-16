"use client";
import { MoreVertical } from "lucide-react";
import MediaModal from "./mediaModal";
import GroupModal from "./group-chat/GroupModal";
import { IChatHead, ChatRoomMember, IMessage } from "@/types/chatTypes";
import { ecnf } from "@/utils/constants/env";

import useCustomSWR from "@/components/shared/hooks/common/customSwr";
import ConfirmationModal from "@/components/shared/ui/organisms/modal/confirmationModal";
import CallControls from "./components/Button/callButtons";
import ChatRoomMenu from "@/components/features/chat/components/chatRoomMenu";
import useChatroomHead from "@/components/shared/hooks/chat/useChatroomHead";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import BackButton from "@/components/features/chat/components/Button/BackButton";
import ChatroomSearch from "@/components/features/chat/components/ChatroomSearch";
import { useState } from "react";

// Create menu configurations
export default function ChatHeader({
  selectedActiveChat,
  fetchedMessages
}: {
  selectedActiveChat: IChatHead;
  fetchedMessages: IMessage[]
}) {
  const { data, mutate } = useCustomSWR<ChatRoomMember[]>(
    `${ecnf.apiUrl}/chats/${selectedActiveChat.chatRoomId}/members`,
    { revalidateIfStale: false }
  );

  const user = useAuth().user;

  const {
    closeConfirmModal,
    closeGroupModal,
    handleOptionClick,
    toggleDropdown,
    toggleMediaModal,
    onConfirm,

    isConfirmModalOpen,
    isDropdownOpen,
    isGroupModalOpen,
    isMediaModalOpen,
    dropdownRef,
  } = useChatroomHead({ selectedActiveChat });

  const [showSearch, setShowSearch] = useState(false);

  return (
    <div
      className="bg-[#1f2329] flex items-center justify-between px-2 max-xs:px-0 py-2 border-b-2 border-gray-700 relative
    
    "
    >
      <div className="flex items-center gap-2 max-xs:gap-0.5">
        <BackButton />
        <Avatar
          avatarName={selectedActiveChat.oppositeUsername || "GC"}
          profilePicture={
            selectedActiveChat.oppositeProfilePicture ||
            selectedActiveChat.roomImage
          }
          href={
            selectedActiveChat.isGroup
              ? "#"
              : `${ecnf.frontendUrl}/search-people/${selectedActiveChat.oppositeUserId}`
          }
        />

        <div className="capitalize text-[14px] max-xs:text-[12px] max-xs:ml-1 ">
          <h2 className="text-white text-[18px] max-xs:text-[16px] ">
            {selectedActiveChat.isGroup
              ? selectedActiveChat.roomName
              : selectedActiveChat.oppositeUsername}
          </h2>
          {selectedActiveChat.isGroup ? (
            <p className=" text-green-400"> online </p>
          ) : selectedActiveChat?.oppositeUserStatus === "online" ? (
            <p className=" text-green-400"> online </p>
          ) : (
            <p className=" text-gray-400"> offline </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 max-xs:gap-0 justify-center relative">
        {!selectedActiveChat.isGroup && (
          <CallControls
            localUser={{
              profilePicture: user?.profilePicture || "",
              userId: user?.userId as string,
              username: user?.username as string,
            }}
            recipient={{
              profilePicture:
                selectedActiveChat.oppositeProfilePicture as string,
              userId: selectedActiveChat.oppositeUserId as string,
              username: selectedActiveChat.oppositeUsername as string,
            }}
          />
        )}

        <ChatroomSearch
          showSearch={showSearch}
          toggleSearch={() => setShowSearch(prev => !prev)}
          fetchedMessages={fetchedMessages}
        />

        <button
          className="text-gray-400 p-2 rounded-full hover:text-white transition-colors duration-200 focus:outline-none"
          onClick={toggleDropdown}
        >
          <MoreVertical size={24} />
        </button>

        {selectedActiveChat && (
          <ChatRoomMenu
            dropdownRef={dropdownRef}
            handleOptionClick={handleOptionClick}
            isDropdownOpen={isDropdownOpen}
            roomInfo={{
              blockedUserId: selectedActiveChat.blockedUserId,
              isGroup: selectedActiveChat.isGroup,
              oppositeUserId: selectedActiveChat.oppositeUserId,
              removedAt: selectedActiveChat.removedAt,
            }}
            toggleShowSearch={() => {
              setShowSearch(!showSearch);
              toggleDropdown();
            }}
          />
        )}
      </div>

      {isMediaModalOpen && (
        <MediaModal
          toggleMediaModal={toggleMediaModal}
          selectedChatId={selectedActiveChat.chatRoomId}
        />
      )}

      {isGroupModalOpen && (
        <GroupModal
          roomName={selectedActiveChat.roomName as string}
          onClose={() => {
            closeGroupModal();
          }}
          members={data || []}
          mutate={mutate}
          roomImage={selectedActiveChat.roomImage}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={onConfirm}
        confirmBtnText="Delete chat"
        title="Are you sure, You want to clear the chat?"
        children="Deleting a chat would mean, you lose all the messages and files shared upto this point."
      />
    </div>
  );
}
