export interface IChatHead {
  chatRoomId: string;
  isGroup: boolean;
  roomName: string;
  oppositeUser: {
    userId: string,
    username: string;
    profilePicture: string | null;
    userStatus: "online" | "offline";
  };
  unreadCount: number;
  lastMessage: string | undefined;
  lastMessageSenderId: string | undefined;
  lastActivity: string | null;
}




export type Reactions = {
  emoji: string;
  users: string[];
};

export type Attachment = {
  file: File;
  url: string;
  type: "image" | "video" | "document";
}

type Message = {
  messageId: string;
  content: string;
  time: string;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface IMessage extends Message {
  type: "incoming" | "outgoing";
  reactions: Reactions[];
  senderName: string;
  profilePicture: string;
  parentMessage?: {
    messageId?: string,
    content?: string,
    senderName?: string
  } | null;
  
  readBy: Array<{
    readerName: string,
    profilePicture: string,
    readerId: string
  }>;


  attachments?: Attachment[];
  status?: "sent" | "delivered" | "read"
}