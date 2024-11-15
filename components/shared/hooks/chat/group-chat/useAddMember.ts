import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { useChatContext } from "@/components/shared/contexts/chat/chatContext";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { ChatRoomMember, MinifiedMessage } from "@/types/chatTypes";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { IUserMiniProfile } from "@/types/userTypes";
import { ecnf } from "@/utils/constants/env";
import { buildSystemMessage } from "@/utils/utils";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { mutate } from "swr";

export default function useAddMember(onClose: () => void) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IUserMiniProfile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUserMiniProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState({
    notFound: false,
    warning: false,
    default: true,
  });

  const abortController = useRef<AbortController | null>(null);
  const queryRef = useRef("");
  const chatRoomId = useParams().chatId;

  const { updateLastActivity } = useChatContext();
  const { checkAndRefreshToken } = useAuth();
  const { showNotification } = useCommunication();

  const handleSubmit = async () => {
    setShowMessage({
      default: false,
      notFound: false,
      warning: false,
    });

    if (searchTerm.length < 2 || searchTerm.length > 30) {
      setShowMessage({
        default: false,
        notFound: false,
        warning: true,
      });
      return;
    }

    setIsLoading(true);

    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      const token = await checkAndRefreshToken();
      const result = await fetch(
        `${ecnf.apiUrl}/users?query=${encodeURIComponent(searchTerm)}&chatRoomId=${chatRoomId}`,
        {
          signal: abortController.current.signal,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (result.ok) {
        const data: { data: IUserMiniProfile[] } = await result.json();
        setSearchResults(data.data);
        if (data.data.length === 0) {
          queryRef.current = searchTerm;
          setShowMessage({
            default: false,
            notFound: true,
            warning: false,
          });
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching people:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleUserSelection = (user: IUserMiniProfile) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.userId === user.userId);
      if (isSelected) {
        return prev.filter((u) => u.userId !== user.userId);
      }
      return [...prev, user];
    });
  };

  const handleAddMember = async () => {
    const token = await checkAndRefreshToken();
    const res = await fetch(`${ecnf.apiUrl}/chats/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatRoomId: chatRoomId,
        users: selectedUsers.map((user) => ({
          userId: user.userId,
          username: user.username,
        })),
      }),
    });
    if (res.ok) {
      const data: ApiResponse<MinifiedMessage> = await res.json();
      if (!data.data) return;
      const newMessage = buildSystemMessage(data.data);
      mutate(
        `${ecnf.apiUrl}/chats/${chatRoomId}/members`,
        (current?: ChatRoomMember[]) => {
          if (!current) return current;
          const newMembers: ChatRoomMember[] = selectedUsers.map((m) => {
            return {
              isAdmin: false,
              isCreator: false,
              userId: m.userId,
              username: m.username,
              profilePicture: m.profilePicture || undefined,
              userStatus: "offline",
              nickName: "",
            };
          });

          return [...current, ...newMembers];
        },
        false
      );
      mutate(
        `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
        (current?: AllMessageResponse) => {
          if (!current) return current;
          return {
            allReceipts: current.allReceipts,
            attachments: current.attachments,
            messages: [newMessage, ...current.messages],
          };
        }
      );

      updateLastActivity(chatRoomId as string, newMessage);
      showNotification("Membe added", "success");
    } else {
      showNotification("Error occured", "error");
    }
    onClose();
  };

  return {
    isLoading,
    showMessage,
    searchResults,
    selectedUsers,
    searchTerm,

    handleAddMember,
    handleInputChange,
    toggleUserSelection,
    handleSubmit,
  };
}
