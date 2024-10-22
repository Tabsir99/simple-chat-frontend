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
import { useSocket } from "@/components/contextProvider/websocketContext";

export default function FriendList() {
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "blocked">(
    "friends"
  );
  const { socket } = useSocket();
  const {user} = useAuth()
  const { data, mutate } = useCustomSWR<
    {
      userId: string;
      username: string;
      status: "accepted" | "pending" | "blocked";
      profilePicture: string;
      isCurrentUserSender: boolean;
    }[]
  >(`${ecnf.apiUrl}/friendships`);

  const { activities, updateActivity } = useRecentActivities();
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
      count: activities.acceptedFriendRequests,
    },
    {
      id: "pending",
      icon: UserPlus,
      label: "Pending",
      count: activities.friendRequests,
    },
    {
      id: "blocked",
      icon: UserX,
      label: "Blocked",
      count: 0,
    },
  ]);

  useEffect(() => {
    if (!socket || !user) return;
  
    let shouldEmit = false;
  
    if (activeTab === "friends" && activities.acceptedFriendRequests > 0) {
      updateActivity("acceptedFriendRequests", "set", 0);
      shouldEmit = true;
    }
  
    if (activeTab === "pending" && activities.friendRequests > 0) {
      updateActivity("friendRequests", "set", 0);
      shouldEmit = true;
    }
  
    if (shouldEmit) {
      socket.emit("activity:reset", {type: "friends", userId: user.userId});
    }
  }, [socket, activeTab, user, activities.acceptedFriendRequests, activities.friendRequests]);

  useEffect(() => {
    setTabs(prev => {
      return prev.map(t => {
        if(t.id === "friends"){
          return {...t,count: activities.acceptedFriendRequests}
        }
        if(t.id === "pending"){
          return {...t,count: activities.friendRequests}
        }
        return t
      })
    })
  },[activities.acceptedFriendRequests,activities.friendRequests])

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
    </div>
  );
}
