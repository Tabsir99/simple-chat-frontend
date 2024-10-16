"use client";
import { useEffect, useState } from "react";
import { Users, UserPlus, UserX } from "lucide-react";
import useCustomSWR from "@/components/hooks/customSwr";
import { NoConnectionsMessage } from "@/components/searchpeople/noConnections";
import { FriendItem } from "@/components/searchpeople/friendItem";
import { CustomButton } from "@/components/ui/buttons";
import { useRecentActivities } from "@/components/contextProvider/recentActivityContext";
import { useAuth } from "@/components/authComps/authcontext";
import { ecnf } from "@/utils/env";

export default function FriendList() {
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "blocked">(
    "friends"
  );
  const { data, mutate } = useCustomSWR<
    {
      userId: string;
      username: string;
      status: "accepted" | "pending" | "blocked";
      profilePicture: string;
      isCurrentUserSender: boolean;
    }[]
  >(`${ecnf.apiUrl}/friendships`);

  const { state } = useRecentActivities();
  const [tabs, setTabs] = useState<
    {
      id: "friends" | "pending" | "blocked";
      icon: any;
      label: string;
      count: number;
    }[]
  >([
    {
      id: "friends",
      icon: Users,
      label: "Friends",
      count: state.unseenAcceptedFriendRequests,
    },
    {
      id: "pending",
      icon: UserPlus,
      label: "Pending",
      count: 0,
    },
    {
      id: "blocked",
      icon: UserX,
      label: "Blocked",
      count: 0,
    },
  ]);

  useEffect(() => {
    const newTabs = tabs.map((tab) => {
      if (tab.id === "friends") {
        return {
          ...tab,
          count: state.unseenAcceptedFriendRequests,
        };
      }

      return tab;
    });
    setTabs(newTabs);
  }, [state]);

  useEffect(() => {
    const newTabs = tabs.map((tab) => {
      if (tab.id === "pending") {
        return {
          ...tab,
          count: data?.filter((user) => (user && !user.isCurrentUserSender && user.status === "pending")).length || 0,
        };
      }

      return tab;
    });
    setTabs(newTabs);
  }, [data]);

  const renderConnections = () => {
    const filteredUsers = data?.filter((user) => {
      if (!user) return false;
      switch (activeTab) {
        case "friends":
          return user.status === "accepted";
        case "pending":
          return user.status === "pending";
        case "blocked":
          return user.status === "blocked";
        default:
          return false;
      }
    });

    if (filteredUsers?.length === 0) {
      return <NoConnectionsMessage type={activeTab} />;
    }

    return filteredUsers?.map((item) => (
      <FriendItem key={item.userId} {...item} mutate={mutate} />
    ));
  };

  return (
    <div className="bg-gray-900/70 p-6 h-full w-full border-l-2 border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Friends List</h2>

      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <CustomButton
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className="relative"
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
            {tab.count > 0 && tab.id !== "blocked" && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </CustomButton>
        ))}
      </div>

      <div className="gap-3 grid grid-cols-2 items-center">
        {data?.length === 0 ? (
          <NoConnectionsMessage type={activeTab} />
        ) : (
          renderConnections()
        )}
      </div>

      <BackgroundJob />
    </div>
  );
}

const BackgroundJob = () => {
  const { checkAndRefreshToken } = useAuth()
  const { resetUnseenAcceptedFriendRequests, resetTotalNewFriendRequests, state } = useRecentActivities()


  useEffect(() => {

    if(state.totalNewFriendRequests === 0 && state.unseenAcceptedFriendRequests ===0) return

    (async () => {

      const token = await checkAndRefreshToken()
      await fetch(`${ecnf.apiUrl}/users/me/recent-activities`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event: "reset-friends"
        })
      });
      resetUnseenAcceptedFriendRequests()
      resetTotalNewFriendRequests()
    })()
  }, [checkAndRefreshToken, state]);
  return null;
};
