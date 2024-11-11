export interface IUserProfile {
  username: string;
  email: string;
  bio?: string;
  title?: string;
  profilePicture?: string;
  createdAt: string;
  totalChats: number;
  totalFriends: number;
  totalMessageSent: number;
  status: Friends["status"];
  isCurrentUserSender: boolean;
  isCurrentUserBlocked?: boolean;
  isLoading?: boolean;
}

export interface IIsEditing {
  username: boolean;
  bio: boolean;
}

export interface IUserMiniProfile {
  userId: string;
  username: string;
  profilePicture: string;
}

export interface Friends {
  userId: string;
  username: string;
  status: "accepted" | "pending" | "blocked" | "canceled";
  profilePicture: string;
  isCurrentUserSender: boolean;
}
