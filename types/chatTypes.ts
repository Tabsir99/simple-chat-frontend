export interface IChatHead {
  chatRoomId: string;
  isGroup: boolean;
  roomName: string;
  roomImage: string | null;
  roomStatus: "online" | "offline";
  privateChatMemberId: string | false;
  unreadCount: number;
  lastMessage: {
    content?: string;
    attachmentType?: FileType;
    sender: {
      userId?: string;
      username?: string;
    };
  };
  lastActivity: string;
  isTyping?: { profilePicture: string; username: string; userId: string }[];
}

export type ChatMembers =
  | {
      memberName: string;
      isAdmin: boolean;
      memberPicture: string | null;
      memberId: string;
      memberStatus: "online" | "offline";
      memberNickname: string | null;
      isCreator: boolean;
    }[]
  | undefined;

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

// export type Attachment = {
//   url: string;
//   type: "image" | "video" | "document";
// };

// type Message = {
//   messageId: string;
//   content: string;
//   time: string;
//   isEdited?: boolean;
//   isDeleted?: boolean;
//   status: "sent" | "failed" | "delivered" | "seen";
//   type: "system" | "user";
// };

// export interface IMessage extends Message {
//   reactions: Reactions[];

//   sender: {
//     senderName: string;
//     profilePicture: string;
//     senderId: string;
//   };
//   parentMessage?: {
//     messageId?: string;
//     content?: string;
//     senderName?: string;
//   } | null;

//   attachments?: Attachment[];
// }

export interface IMessage extends Message {
  MessageReaction: Reactions[];
  sender: User | null;
  parentMessage: ParentMessage | null;
}

type Message = {
  messageId: string;
  content: string;
  createdAt: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  status: "sent" | "delivered" | "seen" | "failed" | "sending";
  type: "user" | "system";
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
  file?: File
}

interface User {
  username: string;
  profilePicture: string | null;
  userId: string;
}

interface ParentMessage {
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
