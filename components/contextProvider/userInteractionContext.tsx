'use client'

import { createContext, useContext, useState } from 'react';

// Define the shape of our context state
interface UserInteractionsState {
  friendRequestsSent: number;
  pendingFriendRequests: number;
  newMessagesCount: number;
  unseenAcceptedFriendRequests: number;
}

// Define the shape of our context
interface UserInteractionsContextType {
  state: UserInteractionsState;
  incrementFriendRequestsSent: () => void;
  decrementFriendRequestsSent: () => void;
  setPendingFriendRequests: (count: number) => void;
  incrementNewMessagesCount: () => void;
  resetNewMessagesCount: () => void;
  incrementUnseenAcceptedFriendRequests: () => void;
  resetUnseenAcceptedFriendRequests: () => void;
}

// Create the context
const UserInteractionsContext = createContext<UserInteractionsContextType | undefined>(undefined);

// Create a provider component
export const UserInteractionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserInteractionsState>({
    friendRequestsSent: 0,
    pendingFriendRequests: 0,
    newMessagesCount: 0,
    unseenAcceptedFriendRequests: 0,
  });

  // Helper function to update state
  const updateState = (newState: Partial<UserInteractionsState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };


  const value: UserInteractionsContextType = {
    state,
    incrementFriendRequestsSent: () => updateState({ friendRequestsSent: state.friendRequestsSent + 1 }),
    decrementFriendRequestsSent: () => updateState({ friendRequestsSent: Math.max(0, state.friendRequestsSent - 1) }),
    setPendingFriendRequests: (count: number) => updateState({ pendingFriendRequests: count }),
    incrementNewMessagesCount: () => updateState({ newMessagesCount: state.newMessagesCount + 1 }),
    resetNewMessagesCount: () => updateState({ newMessagesCount: 0 }),
    incrementUnseenAcceptedFriendRequests: () => updateState({ unseenAcceptedFriendRequests: state.unseenAcceptedFriendRequests + 1 }),
    resetUnseenAcceptedFriendRequests: () => updateState({ unseenAcceptedFriendRequests: 0 }),
  };

  return (
    <UserInteractionsContext.Provider value={value}>
      {children}
    </UserInteractionsContext.Provider>
  );
};

// Custom hook to use the context
export const useUserInteractions = () => {
  const context = useContext(UserInteractionsContext);
  if (context === undefined) {
    throw new Error('useUserInteractions must be used within a UserInteractionsProvider');
  }
  return context;
};