"use client";
import React, { useEffect, useState } from "react";
import { Users, UserPlus, UserX } from "lucide-react";
import useCustomSWR from "@/components/hooks/customSwr";
import { NoConnectionsMessage } from "@/components/searchpeople/noConnections";
import { FriendItem } from "@/components/searchpeople/friendItem";
import { CustomButton } from "@/components/ui/buttons";
import useFriendshipActions from "@/components/hooks/useFriendshipActions";

export default function FriendList() {
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "blocked">(
    "friends"
  );
  const { handleAction, statuses, setStatuses } = useFriendshipActions()
  
  const { data } = useCustomSWR<
    {
      userId: string;
      username: string;
      status: "online" | "offline" | "pending" | "blocked";
      profilePicture: string;
      isSender: boolean;
    }[]
  >(`${process.env.NEXT_PUBLIC_API_URL}/friendships`);

  useEffect(() => {
    if (!data) return;
    setStatuses((prev) => {
      const newStatuses = new Map(prev);
      data.forEach((res) => {
        newStatuses.set(res.userId, res.status);
      });
      return newStatuses;
    });
  }, [data]);

  const tabs: {
    id: "friends" | "pending" | "blocked";
    icon: any;
    label: string;
    count: number;
    }[] = [
    {
      id: "friends",
      icon: Users,
      label: "Friends",
      count:
        data?.filter(
          (connection) =>
            connection.status === "online" || connection.status === "offline"
        ).length || 0,
    },
    {
      id: "pending",
      icon: UserPlus,
      label: "Pending",
      count:
        data?.filter((connection) => connection.status === "pending").length ||
        0,
    },
    {
      id: "blocked",
      icon: UserX,
      label: "Blocked",
      count:
        data?.filter((connection) => connection.status === "blocked").length ||
        0,
    },
  ];

  const renderConnections = () => {
    const filteredUsers = data?.filter((user) => {
      switch (activeTab) {
        case "friends":
          return (
            statuses.get(user.userId) === "online" ||
            statuses.get(user.userId) === "offline"
          );
        case "pending":
          return statuses.get(user.userId) === "pending";
        case "blocked":
          return statuses.get(user.userId) === "blocked";
        default:
          return false;
      }
    });

    if (filteredUsers?.length === 0) {
      return <NoConnectionsMessage type={activeTab} />;
    }

    return filteredUsers?.map((item) => (
      <FriendItem
        key={item.userId}
        {...item}
        onAccept={() => handleAction("accept", item.userId, item.isSender)}
        onReject={() => handleAction("reject", item.userId, item.isSender)}
        onBlock={() => handleAction("block", item.userId, item.isSender)}
        onUnblock={() => handleAction("unblock", item.userId, item.isSender)}
      />
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
            {tab.count > 0 && tab.id === "pending" && (
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
