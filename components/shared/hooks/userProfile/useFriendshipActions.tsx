import { useState } from "react";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { Friends, IUserProfile } from "@/types/userTypes";
import { ecnf } from "@/utils/constants/env";
import { mutate as gMutate } from "swr";
import { ApiResponse } from "@/types/responseType";
import { IChatHead } from "@/types/chatTypes";
import { useCommunication } from "../../contexts/communication/communicationContext";

type Action = "accept" | "reject" | "block" | "unblock" | "create" | "cancel";

const useFriendshipActions = () => {

  const [loading, setLoading] = useState(false);

  const { checkAndRefreshToken } = useAuth();
  const { showNotification } = useCommunication();

  const handleFriendshipAction = async (action: Action, userId: string | null) => {
    const fetchFunction = async (status: Friends["status"]) => {
      const url =
        action === "create"
          ? `${ecnf.apiUrl}/friendships`
          : `${ecnf.apiUrl}/friendships/${userId}`;
      const method = action === "create" ? "POST" : "PATCH";
      const reqBody =
        action === "create"
          ? JSON.stringify({ targetUserId: userId })
          : JSON.stringify({ status });

      try {
        setLoading(true);
        const token = await checkAndRefreshToken();

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: reqBody,
        });

        const data: ApiResponse<{
          status: Friends["status"];
          chatRoomId: string | null;
        }> = await response.json();

        gMutate(
          `${ecnf.apiUrl}/friendships`,
          (current: Friends[] | undefined) => {
            if (!current) return current;
            return current.map((f) => {
              if (f.userId !== userId || !data.data) return f;
              return {
                ...f,
                status: data.data?.status,
              };
            });
          },
          false
        );

        gMutate(
          `${ecnf.apiUrl}/users/${userId}`,
          (current: {
            userInfo: IUserProfile;
            isOwnProfile: boolean;
          } | undefined) => {
            if (!current || !data.data) return current;
            return {
              ...current,
              userInfo: {...current.userInfo,status: data.data.status,isCurrentUserSender: true}
            };
          },
          false
        );


        if (data.data?.status === "blocked" || data.data?.status === "canceled") {
          gMutate(
            `${ecnf.apiUrl}/chats`,
            (current: IChatHead[] | undefined) => {
              if (!current) return current;
              return current.map((chatHead) => {
                if (chatHead.chatRoomId !== data.data?.chatRoomId) {
                  return chatHead;
                }
                return {
                  ...chatHead,
                  blockedUserId: status === "blocked" ? userId : null,
                };
              });
            }
          );
        }

        if (!response.ok) {
          showNotification(
            `Error occured! Could not perform the action`,
            "error"
          );
        }
        if (action === "accept") {
          gMutate(`${ecnf.apiUrl}/chats`);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    switch (action) {
      case "reject":
        await fetchFunction("blocked");
        break;
      case "cancel":
        await fetchFunction("canceled");
        break;
      case "block":
        await fetchFunction("blocked");
        break;
      case "unblock":
        await fetchFunction("canceled");
        break;
      case "accept":
        await fetchFunction("accepted");
        break;
      case "create":
        await fetchFunction("pending");
        break;
    }
  };

  return {
    handleFriendshipAction,
    loading,
  };
};

export default useFriendshipActions;
