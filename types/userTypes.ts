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
  status: "pending"|"accepted"|"blocked"|"",
  isSender: boolean
}

export interface IIsEditing {
  username: boolean;
  bio: boolean;
  title: boolean;
}


export interface IUserMiniProfile {
  userId: string;              // Unique identifier for the user
  username: string;           // Name of the user
  bio: string;            // Biography of the user
  profilePicture: string;  // URL or path to the profile picture
}
