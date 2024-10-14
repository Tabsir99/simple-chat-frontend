import React, { useState } from "react";
import { UserPlus, UserCheck, UserX, Clock, X, Shield } from "lucide-react";
import { ApiResponse } from "@/types/responseType";
import { CustomButton } from "../ui/buttons";

type FriendshipStatus = "pending" | "accepted" | "blocked" | "";

interface AddFriendBtnProps {
  userId: string | null;
  status: FriendshipStatus;
  isSender: boolean;
  checkAndRefreshToken: () => Promise<string | null>;
}

export default function AddFriendBtn({ userId, status, isSender, checkAndRefreshToken }: AddFriendBtnProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false)

  const statusConfig = {
    pending: {
      text: isSender ? "Respond" : "Pending",
      icon: Clock,
      variant: "default" as const,
    },
    accepted: {
      text: "Friends",
      icon: UserCheck,
      variant: "default" as const,
    },
    blocked: {
      text: !isSender ? "Blocked" : "Unblock",
      icon: Shield,
      variant: "danger" as const,
    },
    "": {
      text: "Add Friend",
      icon: UserPlus,
      variant: "success" as const,
    },
  };

  const handleFriendshipAction = async (action: string, newStatus?: FriendshipStatus | "unblocked") => {
    if (!userId) return;

    const method = action === "add" ? "POST" : "PATCH";
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/friendships${action === "add" ? "" : `/${userId}`}`;
    const body = JSON.stringify(action === "add" ? { targetUserId: userId } : { status: newStatus });

    try {
      setLoading(true)
      const token = await checkAndRefreshToken();
      if (!token) throw new Error("No token available");
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: body
      })
      if(response.ok){
        const data: ApiResponse = await response.json()
        setCurrentStatus(data.data.status)
      }
    } catch (error) {
      console.error("Error performing friendship action:", error);
    }
    finally {
      setLoading(false)
    }
  };

  const { text, icon: Icon, variant } = statusConfig[currentStatus] || statusConfig[""];

  if (currentStatus === "pending" && isSender) {
    return (
      <div className="flex gap-2">
        <CustomButton onClick={() => handleFriendshipAction("update", "accepted")} variant="success">
          <UserCheck className="w-4 h-4 mr-2" />
          Accept
        </CustomButton>
        <CustomButton onClick={() => handleFriendshipAction("update", "blocked")} variant="danger">
          <UserX className="w-4 h-4 mr-2" />
          Reject
        </CustomButton>
      </div>
    );
  }

  if (currentStatus === "pending" && !isSender) {
    return (
      <CustomButton onClick={() => handleFriendshipAction("update", "unblocked")} variant="outline">
        <X className="w-4 h-4 mr-2" />
        Cancel Request
      </CustomButton>
    );
  }

  if (currentStatus === "accepted") {
    return (
      <div className="flex gap-2">
        <CustomButton onClick={() => handleFriendshipAction("update", "")} variant={variant}>
          <Icon className="w-4 h-4 mr-2" />
          {text}
        </CustomButton>
        <CustomButton onClick={() => handleFriendshipAction("update", "blocked")} variant="danger">
          <Shield className="w-4 h-4 mr-2" />
          Block
        </CustomButton>
      </div>
    );
  }

  return (
    <CustomButton
      onClick={() => handleFriendshipAction(currentStatus === "blocked" && isSender ? "update" : "add", "unblocked")}
      variant={variant}
      disabled={loading}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Icon className="w-4 h-4 mr-2" />
      )}
      {text}
    </CustomButton>
  );
}