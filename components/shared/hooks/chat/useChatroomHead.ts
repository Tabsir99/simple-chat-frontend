import { IChatHead, MenuAction } from "@/types/chatTypes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mutate as globalMutate } from "swr";
import useFriendshipActions from "../userProfile/useFriendshipActions";
import { ecnf } from "@/utils/constants/env";
import { useAuth } from "../../contexts/auth/authcontext";
import { useCommunication } from "../../contexts/communication/communicationContext";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useChatContext } from "../../contexts/chat/chatContext";

export default function useChatroomHead({
  selectedActiveChat,
}: {
  selectedActiveChat: IChatHead;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { socket } = useCommunication()

  const { handleFriendshipAction } = useFriendshipActions();
  const { checkAndRefreshToken, user } = useAuth();
  const { showNotification } = useCommunication();
  const { setActiveChats } = useChatContext();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMediaModal = () => {
    setIsMediaModalOpen((prev) => !prev);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const onConfirm = async () => {
    const token = await checkAndRefreshToken();
    const res = await fetch(
      `${ecnf.apiUrl}/chats/${selectedActiveChat.chatRoomId}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      globalMutate(
        `${ecnf.apiUrl}/chats/${selectedActiveChat.chatRoomId}/messages`,
        (current: AllMessageResponse | undefined) => {
          if (!current) return current;
          return {
            allReceipts: [],
            attachments: [],
            messages: [],
          };
        },
        false
      );
      setActiveChats((prev) => {
        if (!prev) return prev;
        return prev.map((chat) => {
          if (chat.chatRoomId !== selectedActiveChat.chatRoomId) return chat;
          return {
            ...chat,
            chatClearedAt: new Date().toISOString(),
            unreadCount: 0,
          };
        });
      });
      router.push("/chats");

      showNotification("Chat cleared!", "success");
    } else {
      showNotification("Something went wrong, Could not clear chat", "error");
    }
  };

  const handleOptionClick = async (action: MenuAction) => {
    switch (action.type) {
      case "NAVIGATE":
        router.push(action.path);
        break;

      case "TOGGLE_MEDIA":
        toggleMediaModal();
        break;

      case "TOGGLE_GROUP_MODAL":
        setIsGroupModalOpen(true);
        break;

      case "CREATE_GROUP":
        const token = await checkAndRefreshToken();
        const response = await fetch(`${ecnf.apiUrl}/chats/groups`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            members: [
              {
                userId: user?.userId,
                username: user?.username,
              },
              {
                userId: selectedActiveChat.oppositeUserId,
                username: selectedActiveChat.oppositeUsername,
              },
            ],
            groupName: action.name,
          }),
        });
        if (response.ok) {
          const data = (await response.json()) as ApiResponse<{
            signedUrl: string;
            chatRoom: {
              chatRoomId: string;
              isGroup: boolean;
              roomName: string | null;
              createdBy: string | null;
              roomImage: string | null;
            };
          }>;
          globalMutate(`${ecnf.apiUrl}/chats`);
        } else {
          showNotification("Could not create a group", "error");
        }
        break;

      case "BLOCK":
        handleFriendshipAction("block", selectedActiveChat.oppositeUserId);
        break;

      case "UNBLOCK":
        handleFriendshipAction("cancel", selectedActiveChat.oppositeUserId);
        break;

      case "DELETE_CHAT":
        setIsConfirmModalOpen(true);

      default:
        break;
    }

    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener
      );
    };
  }, [selectedActiveChat]);

  return {
    handleOptionClick,
    toggleDropdown,
    closeGroupModal,
    closeConfirmModal,
    toggleMediaModal,
    onConfirm,

    isConfirmModalOpen,
    isDropdownOpen,
    isGroupModalOpen,
    isMediaModalOpen,
    dropdownRef,
  };
}
