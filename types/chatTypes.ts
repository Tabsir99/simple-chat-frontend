export interface IChatHead {
  chatRoomId: string;
    isGroup: boolean;
    roomName: string;
    roomImage: string | null;
    roomStatus: "online"|"offline";
    privateChatMemberId: string | false;
    unreadCount: number;
    lastMessage: string | undefined;
    lastMessageSenderId: string | undefined;
    lastActivity: string,
    isTyping?: { profilePicture: string, username: string, userId: string }[]
}


export type ChatMembers = {
  memberName: string;
  isAdmin: boolean;
  memberPicture: string | null;
  memberId: string;
  memberStatus: "online"|"offline";
  memberNickname: string | null;
  isCreator: boolean;
}[] | undefined


export type Reactions = {
  emoji: string;
  users: string[];
};

export type Attachment = {
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
  reactions: Reactions[];
  

  sender: {
    senderName: string;
    profilePicture: string;
    senderId: string
  }
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
  status?: "sending" | "sent" | "delivered" | "failed" | "read"
}



export type TypingEventData = {
  chatRoomId: string;
  username: string;
  profilePicture: string; 
  isStarting: boolean;
  userId: string
}











interface IMessageReceipt {
  receiptId: string;
  lastReadMessageId: string;
  userId: string;
  chatRoomId: string;
  readAt: Date;
  user: {
    profilePicture?: string;
    name: string;
  };
}