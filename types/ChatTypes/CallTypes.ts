import { Socket } from "socket.io-client";

export interface CallParticipant {
  userId: string;
  username: string;
  profilePicture: string | null;
}

export interface CallSession {
  callId: string;
  caller: CallParticipant;
  recipients: CallParticipant[];
  isVideoCall: boolean;
  status: "ringing" | "connected" | "ended";
  chatRoomId: string;
  offer?: RTCSessionDescriptionInit;
  startTime?: Date;
  endTime?: Date;
}

export interface CommunicationContextType {
  showNotification: (
    message: string,
    type?: NotificationProps["type"],
    time?: number
  ) => void;
  showIncomingCall: (callSession: CallSession) => void;
  initiateCall: (isVideoCall: boolean, recipients: CallParticipant) => void;
  handleAcceptCall: (
    callId: string,
    offer: RTCSessionDescriptionInit,
    isVideo: boolean,
    chatRoomId: string
  ) => void;
  handleAbortCall: (callId: string, to: string) => void;
  handleEndCall: (callId: string, to: string) => void;
  switchCamera: () => Promise<void>

  socket: Socket | null;
}

export type IncomingCallEvent = {
  event: "call:incoming";
  data: {
    from: RTCSessionDescriptionInit;
    isVideoCall: boolean;
    to: string;
    caller: CallParticipant;
    callId: string;
  };
};
export type CallAnsweredEvent = {
  event: "call:answered";
  data: {
    answer: RTCSessionDescriptionInit;
    callId: string;
  };
};

export type CallEndedEvent = {
  event: "call:ended";
  data: {
    callId: string;
  };
};

export type ICECandidateEvent = {
  event: "ice-candidate";
  data: {
    candidate: RTCIceCandidate;
  };
};

export type CallAbortedEvent = {
  event: "call:aborted";
  data: {
    callId: string;
  };
};

export type CallEvents =
  | IncomingCallEvent
  | CallAnsweredEvent
  | CallEndedEvent
  | ICECandidateEvent
  | CallAbortedEvent;

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationProps {
  notificationId: string;
  message?: string;
  type?: NotificationType;
  time?: number;
  onClose?: (nid: string) => void;
}
