export interface IChatHead {
  chatRoomId: string;
  isGroup: boolean;
  roomName: string;
  roomImage: string | null;
  roomStatus: "online" | "offline";
  privateChatMemberId: string | false;
  unreadCount: number;
  lastMessage: string | undefined;
  lastMessageSenderId: string | undefined;
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
  sender: User | null
  parentMessage: ParentMessage | null
  Attachment: Attachment[]
}


type Message = {
  messageId: string;
  content: string;
  createdAt: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  status: "sent" | "delivered" | "seen" | "failed" | "sending"
  type: "user" | "system"
};

export interface Attachment {
  fileUrl: string;
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
