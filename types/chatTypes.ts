import { ReactNode } from "react";

export interface IChatHead {
  chatRoomId: string;
  isGroup: boolean;
  roomName: string | null;
  roomImage: string | null;
  createdBy: string;
  lastActivity: string;
  blockedUserId: string | null;
  messageContent: string | null;
  senderUserId: string | null;
  senderUsername: string | null;
  fileType: FileType | null;
  callerId: string | null;
  callStatus: "missed" | "ended";
  oppositeUserId: string | null;
  oppositeUsername: string | null;
  oppositeUserStatus: string | null;
  oppositeProfilePicture: string | null;
  unreadCount: number | 0;
  removedAt: string | null;
  chatClearedAt: string | null;
  isTyping?: { profilePicture: string; username: string; userId: string }[];
}

export interface ChatRoomMember {
  username: string;
  nickName?: string;
  userStatus: "online" | "offline";
  isAdmin: boolean;
  isCreator: boolean;
  profilePicture?: string;
  userId: string;
}

export type TypingEventData = {
  chatRoomId: string;
  username: string;
  profilePicture: string;
  isStarting: boolean;
  userId: string;
};

export type Reactions = {
  emoji: string;
  users: string[];
};

export interface IMessage extends Message {
  MessageReaction: Reactions[];
  sender: User | null;
  parentMessage: ParentMessage | null;
  callInformation: CallInformation | null;
}

type Message = {
  messageId: string;
  content: string;
  createdAt: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  status: "sent" | "delivered" | "seen" | "failed" | "sending";
  type: "user" | "system" | "call";
};

// Resulting type
type FileType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "text/plain"
  | "text/html"
  | "text/css"
  | "text/csv"
  | "audio/mpeg"
  | "audio/wav"
  | "audio/m4a"
  | "video/mp4"
  | "video/webm"
  | "application/zip"
  | "application/x-rar-compressed"
  | "application/octet-stream";

export interface AttachmentViewModel {
  fileType: FileType;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  messageId?: string;
  file?: File;
}

interface User {
  username: string;
  profilePicture: string | null;
  userId: string;
}

export interface ParentMessage {
  messageId: string;
  sender: {
    username: string;
  } | null;
  content: string;
}

export interface IMessageReceipt {
  lastReadMessageId: string;
  reader: {
    userId: string;
    username: string;
    profilePicture: string;
  };
}

export type MenuAction =
  | { type: "NAVIGATE"; path: string }
  | { type: "TOGGLE_MEDIA" }
  | { type: "TOGGLE_GROUP_MODAL" }
  | { type: "BLOCK" }
  | { type: "CREATE_GROUP"; name: string }
  | { type: "CLOSE" }
  | { type: "UNBLOCK" }
  | { type: "DELETE_CHAT" };

// Define menu item interface
export interface MenuItem {
  item: string;
  icon: ReactNode;
  action: MenuAction;
}

export type MemberAction = "remove" | "admin" | "nickname" | "message";

export interface MinifiedMessage {
  messageId: string;
  content: string;
  createdAt: string;
}

export interface IMenu {
  message: {
    messageId: string;
    isDeleted: boolean;
    isCurrentUserSender: boolean;
  } | null;
  position: { top: number; left: number } | null;
  showEmojiPicker: boolean;
}

export interface SearchMessageResult {
  message: {
    messageId: string;
    content: string;
    createdAt: string; // ISO date,
    senderName: string;
    senderAvatar: string;
  };
}

export type CallInformation = {
  callerId: string;
  isVideoCall: boolean;
  startTime: string | null;
  endTime: string | null;
  status: "missed" | "ongoing" | "ended";
};
