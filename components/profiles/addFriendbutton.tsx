import { UserPlus, UserCheck, UserX, Clock } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "../ui/loadingbutton";
import { ApiResponse } from "@/types/responseType";

type FriendshipStatus = "pending" | "accepted" | "blocked" | "";


// isSender is a boolean indicating if the profile that is being viewed is the friend request sender.
interface AddFriendBtnProps {
  userId: string | null;
  status: FriendshipStatus;
  isSender: boolean;
  checkAndRefreshToken: () => Promise<string | null>
}

export default function AddFriendBtn({ userId, status, isSender, checkAndRefreshToken }: AddFriendBtnProps) {
  const [loading, setLoading] = useState(false)
  const [statusV, setStatusV] = useState(status)

  const statusConfig = {
    pending: {
      text: isSender ? 'Respond to Request' : 'Request Sent',
      icon: Clock,
      bgColor: 'bg-yellow-600',
      hoverColor: 'hover:bg-yellow-500',
    },
    accepted: {
      text: 'Friends',
      icon: UserCheck,
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-500',
    },
    blocked: {
      text: !isSender ? 'Blocked' : 'Unblock',
      icon: UserX,
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-500',
    },
    "": {
      text: 'Add Friend',
      icon: UserPlus,
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-500',
    },
  };

  const { text, icon: Icon, bgColor, hoverColor } = statusConfig[statusV] || statusConfig[""];

  const handleFriendshipAction = async (action: string, newStatus?: FriendshipStatus | "unblocked") => {
    if ( !userId) return;

    const method = action === 'add' ? 'POST' : 'PATCH';
    const endpoint = action === 'add' 
      ? `${process.env.NEXT_PUBLIC_API_URL}/friendships`
      : `${process.env.NEXT_PUBLIC_API_URL}/friendships/${userId}`;

    const body = action === 'add' 
      ? JSON.stringify({ targetUserId: userId })
      : JSON.stringify({ status: newStatus });

    try {
      setLoading(true)
      const token = await checkAndRefreshToken()
      await new Promise(res => setTimeout(res,2000))
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body,
      });

      if (res.ok) {
        const data: ApiResponse = await res.json()
        setStatusV(data.data.status)
      } else {
        console.error('Failed to perform friendship action');
      }
    } catch (error) {
      console.error('Error performing friendship action:', error);
    }
    finally{
      setLoading(false)
    }
  };


  if (statusV === 'pending' && isSender) {
    return (
      <div className="flex gap-3 items-center">
        <LoadingButton
          isLoading={loading}
          onClick={() => handleFriendshipAction('update', 'accepted')}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg flex items-center transition-colors duration-200"
        >
          <UserCheck className="w-5 h-5 mr-2" />
          {text}
        </LoadingButton>
        <LoadingButton
        isLoading={loading}
          onClick={() => handleFriendshipAction('update', 'blocked')}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg flex items-center transition-colors duration-200"
        >
          <UserX className="w-5 h-5 mr-2" />
          Reject Request
        </LoadingButton>
      </div>
    );
  }

  return (
    <LoadingButton
      isLoading={loading}
      onClick={() => handleFriendshipAction(statusV === 'blocked' && isSender ? 'update' : 'add', 'unblocked')}
      className={`px-4 py-2 ${bgColor} ${hoverColor} text-white font-medium rounded-lg flex items-center transition-colors duration-200 disabled:hover:${bgColor}  `}
      disabled={statusV === "pending" || statusV === "accepted" || (statusV === "blocked" && !isSender) || loading}
    >
      <Icon className="w-5 h-5 mr-2" />
      {text}
    </LoadingButton>
  );
}