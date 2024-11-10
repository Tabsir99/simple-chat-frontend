"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/authcontext";
import { ecnf } from "@/utils/env";
import { usePathname } from "next/navigation";

interface Activities {
  friendRequests: number;
  unseenChats: number;
  acceptedFriendRequests: number;
}

type UpdateAction = "increment" | "decrement" | "set";

interface RecentActivityContextType {
  activities: Activities;
  updateActivity: (type: keyof Activities, action: UpdateAction, value?: number) => void;
}

const RecentActivityContext = createContext<RecentActivityContextType | null>(null);

export const RecentActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activities>({
    friendRequests: 0,
    unseenChats: 0,
    acceptedFriendRequests: 0,
  });

  const { checkAndRefreshToken, loading } = useAuth();
  const pathname = usePathname()
  const currentPathRef = useRef(pathname)
  useEffect(() => {
    currentPathRef.current = pathname
  },[pathname])

  useEffect(() => {
    const fetchActivities = async () => {
      const token = await checkAndRefreshToken();
      if (!token) return;

      const res = await fetch(`${ecnf.apiUrl}/users/me/recent-activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const { data } = await res.json();
        if (data) {
          setActivities({
            friendRequests: data.totalNewFriendRequests,
            unseenChats: data.totalNewUnseenChats,
            acceptedFriendRequests: data.unseenAcceptedFriendRequests,
          });
        }
      }
    };

    if (!loading) {
      fetchActivities();
    }
  }, [loading, checkAndRefreshToken]);

  const updateActivity = (type: keyof Activities, action: UpdateAction, value?: number) => {

    if(type === "unseenChats" && action === "increment" && currentPathRef.current.includes("/chats")) return
    setActivities(prev => {
      const currentValue = prev[type];
      let newValue: number;

      switch (action) {
        case "increment":
          newValue = currentValue + 1;
          break;
        case "decrement":
          newValue = Math.max(0, currentValue - 1);
          break;
        case "set":
          newValue = value !== undefined ? value : currentValue;
          break;
        default:
          return prev;
      }

      return { ...prev, [type]: newValue };
    });
  };

  const value: RecentActivityContextType = {
    activities,
    updateActivity,
  };

  return (
    <RecentActivityContext.Provider value={value}>
      {children}
    </RecentActivityContext.Provider>
  );
};

export const useRecentActivities = (): RecentActivityContextType => {
  const context = useContext(RecentActivityContext);
  if (!context) {
    throw new Error("useRecentActivities must be used within a RecentActivitiesProvider");
  }
  return context;
};