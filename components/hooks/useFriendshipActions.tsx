import { useState } from "react";
import { useAuth } from "@/components/authComps/authcontext";
import { FriendshipStatus } from "@/types/userTypes";
import { useNotification } from "../contextProvider/notificationContext";
import { KeyedMutator } from "swr";
import { ApiResponse } from "@/types/responseType";
import { ecnf } from "@/utils/env";
import { mutate as gMutate } from "swr";

type Action = "accept" | "reject" | "block" | "unblock" | "create" | "cancel";

const useFriendshipActions = <T=any>({
  initFriendshipStatus,
  mutate
}: {
  initFriendshipStatus: FriendshipStatus;
  mutate?: (KeyedMutator<T>)


}) => {
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(initFriendshipStatus);
  const [loading, setLoading] = useState(false);

  const { checkAndRefreshToken } = useAuth();
  const { showNotification } = useNotification()

  const handleFriendshipAction = async (
    action: Action,
    userId: string,
  ) => { 

    const fetchFunction = async (
      status: FriendshipStatus
    ) => {
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

        
        if(!response.ok) {
          showNotification(`Error occured! Could not perform the action`,"error")
        }
        if (action === "accept") {
          gMutate(`${ecnf.apiUrl}/chats`);
        }
      } catch (error) {
      } finally {
        if(mutate){
          mutate()
        }
        setLoading(false);
      }
    };

    switch (action) {
      case "reject":
        await fetchFunction("blocked");
        break;
      case "cancel":
        await fetchFunction("")
        break;
      case "block":
        await fetchFunction("blocked");
        break;
      case "unblock":
        await fetchFunction("");
        break;
      case "accept":
        await fetchFunction("accepted");
        break;
      case "create":
        await fetchFunction("pending")
        break;
    }
  };

  return {
    handleFriendshipAction,
    friendshipStatus,
    setFriendshipStatus,
    loading,
  };
};

export default useFriendshipActions;
