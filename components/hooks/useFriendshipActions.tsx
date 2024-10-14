import { useState } from 'react';
import { useAuth } from "@/components/authComps/authcontext";

type Action = "accept" | "reject" | "block" | "unblock";

const useFriendshipActions = () => {
  const [statuses, setStatuses] = useState(new Map<string, string>());
  const { checkAndRefreshToken } = useAuth();

  const handleAction = async (action: Action, userId: string, isSender: boolean) => {
    const fetchFunction = async (status: "accepted" | "blocked" | "unblocked") => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/friendships/${userId}`;
      const token = await checkAndRefreshToken();

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setStatuses((prev) => {
          const newStatuses = new Map(prev);
          newStatuses.set(userId, action);
          return newStatuses;
        });
      }
    };

    switch (action) {
      case "reject":
        isSender ? await fetchFunction("unblocked") : await fetchFunction("blocked");
        break;
      case "block":
        await fetchFunction("blocked");
        break;
      case "unblock":
        await fetchFunction("unblocked");
        break;
      case "accept":
        await fetchFunction("accepted");
        break;
    }
  };

  return { handleAction, statuses, setStatuses };
};

export default useFriendshipActions;
