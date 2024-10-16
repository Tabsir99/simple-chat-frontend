"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authComps/authcontext";
import { ApiResponse } from "@/types/responseType";
import { ecnf } from "@/utils/env";

// Define the shape of our context
interface RecentActivityContextType {
  state: RecentActivities;
  setPendingFriendRequests: (count: number) => void;
  incrementnewUnseenChats: () => void;
  resetnewUnseenChats: () => void;
  incrementUnseenAcceptedFriendRequests: () => void;
  resetUnseenAcceptedFriendRequests: () => void;
  resetTotalNewFriendRequests: () => void
  incrementTotalNewFriendRequests: () => void
}

type RecentActivities = {
  totalNewFriendRequests: number;
  totalNewUnseenChats: number;
  unseenAcceptedFriendRequests: number;
  initial: boolean
};

// Create the context
const RecentActivityContext = createContext<
RecentActivityContextType | undefined
>(undefined);

// Create a provider component
export const RecentActivitiesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, setState] = useState<RecentActivities>({
    totalNewFriendRequests: 0,
    totalNewUnseenChats: 0,
    unseenAcceptedFriendRequests: 0,
    initial: true
  });

  // Helper function to update state
  const updateState = (newState: Partial<RecentActivities>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const value: RecentActivityContextType = {
    state,
    setPendingFriendRequests: (count: number) =>
      updateState({ totalNewFriendRequests: count }),
    incrementnewUnseenChats: () =>
      updateState({ totalNewUnseenChats: state.totalNewUnseenChats + 1 }),
    resetnewUnseenChats: () => updateState({ totalNewUnseenChats: 0 }),
    incrementUnseenAcceptedFriendRequests: () =>
      updateState({
        unseenAcceptedFriendRequests: state.unseenAcceptedFriendRequests + 1,
      }),
    resetUnseenAcceptedFriendRequests: () =>
      updateState({ unseenAcceptedFriendRequests: 0 }),
    resetTotalNewFriendRequests: () =>
      updateState({ totalNewFriendRequests: 0 }),
    incrementTotalNewFriendRequests: () =>
      updateState({ totalNewFriendRequests: state.totalNewFriendRequests + 1 }),
  };

  const { checkAndRefreshToken, loading } = useAuth();

  useEffect(() => {
    if(!state.initial) return
    (async () => {
      const token = await checkAndRefreshToken();
      if(!token) return
      const res = await fetch(
        `${ecnf.apiUrl}/users/me/recent-activities`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data: ApiResponse<RecentActivities> = await res.json();
        if (data.data) {
          
          setState({ ...data.data, initial: false });
        }
      }
    })();
  }, [loading, checkAndRefreshToken]);

  return (
    <RecentActivityContext.Provider value={value}>
      {children}
    </RecentActivityContext.Provider>
  );
};

// Custom hook to use the context
export const useRecentActivities = () => {
  const context = useContext(RecentActivityContext);
  if (context === undefined) {
    throw new Error(
      "useUserInteractions must be used within a UserInteractionsProvider"
    );
  }
  return context;
};
