import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { useChatContext } from "@/components/shared/contexts/chat/chatContext";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import {
  ChatRoomMember,
  MemberAction,
  MinifiedMessage,
} from "@/types/chatTypes";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { ecnf } from "@/utils/constants/env";
import { buildSystemMessage } from "@/utils/utils";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { KeyedMutator, mutate as gMutate } from "swr";

export default function useMemberAction({
  mutate,
  nickName,
  setIsEditing,
  selectedMember,
  setSelectedMember,
}: {
  mutate: KeyedMutator<ChatRoomMember[]>;
  nickName: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  selectedMember: ChatRoomMember | null;
  setSelectedMember: Dispatch<SetStateAction<ChatRoomMember | null>>;
}) {
  const { checkAndRefreshToken } = useAuth();
  const { showNotification } = useCommunication();
  const { updateLastActivity, activeChats } = useChatContext();
  const chatRoomId = useParams().chatId as string;
  const router = useRouter();

  const handleMemberAction = async (action: MemberAction) => {
    switch (action) {
      case "message":
        if (!activeChats) return;
        const existingChatRoom = activeChats.find(
          (chat) =>
            chat.oppositeUserId === selectedMember?.userId && !chat.isGroup
        );
        if (!existingChatRoom) {
          showNotification(
            "You dont have a active chat with the user, please add them first",
            "warning"
          );
          return router.push(`/search-people/${selectedMember?.userId}`);
        }

        router.push(`/chats/${existingChatRoom.chatRoomId}`);
        break;

      case "admin":
        const token = await checkAndRefreshToken();
        const res = await fetch(`${ecnf.apiUrl}/chats/members`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatRoomId: chatRoomId,
            userId: selectedMember?.userId,
            action: selectedMember?.isAdmin ? "demote" : "promote",
            username: selectedMember?.username,
          }),
        });

        if (res.ok) {
          mutate((current) => {
            if (!current) return current;
            return current.map((mem) => {
              if (mem.userId !== selectedMember?.userId) return mem;
              return {
                ...mem,
                isAdmin: !mem.isAdmin,
              };
            });
          }, false);
          const data: ApiResponse<MinifiedMessage> = await res.json();
          if (!data.data) return;

          const newMessage1 = buildSystemMessage(data.data);

          gMutate(
            `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
            (current?: AllMessageResponse) => {
              if (!current || !data.data) return current;

              return {
                allReceipts: current.allReceipts,
                attachments: current.attachments,
                messages: [newMessage1, ...current.messages],
              };
            },
            false
          );
          updateLastActivity(chatRoomId, newMessage1);
        } else {
          showNotification("Could not perform the action", "error");
        }
        setSelectedMember(null);
        break;

      case "nickname":
        setIsEditing(true);

        break;

      case "remove":
        const toke2 = await checkAndRefreshToken();
        const res2 = await fetch(
          `${ecnf.apiUrl}/chats/${chatRoomId}/members/${selectedMember?.userId}?username=${selectedMember?.username}`,
          {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${toke2}`,
            },
          }
        );
        if (res2.ok) {
          const data: ApiResponse<MinifiedMessage> = await res2.json();
          if (!data.data) return;

          const newMessage = buildSystemMessage(data.data);

          gMutate(
            `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
            (current?: AllMessageResponse) => {
              if (!current || !data.data) return current;
              return {
                allReceipts: current.allReceipts,
                attachments: current.attachments,
                messages: [newMessage, ...current.messages],
              };
            },
            false
          );
          mutate((current) => {
            if (!current) return current;
            return current.filter((mem) => {
              return mem.userId !== selectedMember?.userId;
            });
          }, false);
          updateLastActivity(chatRoomId, newMessage);

          setSelectedMember(null);
        } else {
          showNotification("Could not remove member!", "error");
        }
        break;
    }
  };

  const handleNicknameChange = async (e: any) => {
    setIsEditing(false);
    e.currentTarget.disabled = true;

    const token = await checkAndRefreshToken();
    const res = await fetch(`${ecnf.apiUrl}/chats/members`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatRoomId: chatRoomId,
        userId: selectedMember?.userId,
        nickname: nickName,
        action: "nickname",
        username: selectedMember?.username,
      }),
    });

    if (res.ok) {
      const data: ApiResponse<MinifiedMessage> = await res.json();
      if (!data.data) return;

      const newMessage = buildSystemMessage(data.data);
      gMutate(
        `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
        (current?: AllMessageResponse) => {
          if (!current) return current;

          return {
            allReceipts: current.allReceipts,
            attachments: current.attachments,
            messages: [newMessage, ...current.messages],
          };
        },
        false
      );
      mutate((current) => {
        if (!current) return current;
        return current.map((mem) => {
          if (mem.userId !== selectedMember?.userId) return mem;
          return {
            ...mem,
            nickName: nickName,
          };
        });
      }, false);

      updateLastActivity(chatRoomId, newMessage);
    } else {
      showNotification("Could not perform the action", "error");
    }
    setSelectedMember(null);
  };

  return {
    handleMemberAction,
    handleNicknameChange,
  };
}
