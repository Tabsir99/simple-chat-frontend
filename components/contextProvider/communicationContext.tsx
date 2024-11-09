"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  memo,
  Fragment,
} from "react";
import dynamic from "next/dynamic";
import { v4 as uuid4 } from "uuid";
import { useRTC } from "./useRTC";
import { useAuth } from "../authComps/authcontext";
import { Socket, io } from "socket.io-client";
import { ecnf } from "@/utils/env";
import { NotificationProps, useNotification } from "../hooks/useNotification";
import { useSocketConnection } from "../hooks/useSocket";

import SingleCallUI from "../ui/singleCall";
import MinimizedCall from "@/components/ui/callNotification";

const NotificationPopUp = dynamic(
  () => import("@/components/ui/notificationPopup"),
  { ssr: false }
);
export interface CallParticipant {
  userId: string;
  username: string;
  profilePicture: string | null;
}

export interface CallSession {
  callId: string;
  caller: CallParticipant;
  recipient: CallParticipant;
  isVideoCall: boolean;
  status: "initiating" | "ringing" | "connected" | "ended";
  chatRoomId: string;
  offer?: RTCSessionDescriptionInit;
  startTime?: Date;
  endTime?: Date;
}

interface CommunicationContextType {
  showNotification: (
    message: string,
    type?: NotificationProps["type"],
    time?: number
  ) => void;
  showIncomingCall: (callSession: CallSession) => void;
  initiateCall: (callSession: CallSession) => void;
  handleAcceptCall: (
    callId: string,
    offer: RTCSessionDescriptionInit,
    isVideo: boolean,
    chatRoomId: string
  ) => void;
  handleDeclineCall: (callId: string, to: string) => void;
  handleEndCall: (callId: string) => void;

  socket: Socket | null;
}

const CommunicationContext = createContext<
  CommunicationContextType | undefined
>(undefined);

export const CommunicationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { notifications, showNotification } = useNotification();
  const [activeCalls, setActiveCalls] = useState<CallSession[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const { user: currentUser } = useAuth();

  const { socket } = useSocketConnection(showNotification);
  const {
    createConnection,
    endCall,
    getUserMedia,
    handleAnswer,
    handleIceCandidate,
    handleIncomingCall,
    makeOutgoingCalls,
    localStream,
    remoteStream
  } = useRTC(socket);



  const showIncomingCall = useCallback((callSession: CallSession) => {
    setActiveCalls((prev) => [...prev, { ...callSession, isOutgoing: false }]);
  }, []);

  const initiateCall = useCallback(
    (callSession: CallSession) => {
      setActiveCalls((prev) => [...prev, { ...callSession, isOutgoing: true }]);
      makeOutgoingCalls(
        callSession.chatRoomId,
        callSession.isVideoCall,
        currentUser,
        callSession.callId,
      );
    },
    [socket, currentUser]
  );

  const handleAcceptCall = useCallback(
    (
      callId: string,
      offer: RTCSessionDescriptionInit,
      isVideo: boolean,
      chatRoomId: string
    ) => {
      console.log("Accepting call:", callId);
      setActiveCalls((prev) =>
        prev.map((call) =>
          call.callId === callId ? { ...call, status: "connected" } : call
        )
      );

      handleIncomingCall({
        isVideo: isVideo,
        offer: offer,
        chatRoomId: chatRoomId
      });

    },
    [socket]
  );

  const handleDeclineCall = useCallback(
    (callId: string, to: string) => {
      console.log("Declining call:", callId);
      setActiveCalls((prev) => prev.filter((call) => call.callId !== callId));

      socket?.emit("decline-call", {
        callId,
        to,
      });
    },
    [socket]
  );

  useEffect(() => {
    const callEventHandler = ({ event, data }: CallEvents) => {
      switch (event) {
        case "call:incoming":
          showIncomingCall({
            recipient: currentUser!,
            caller: data.caller,
            isVideoCall: data.isVideo,
            status: "ringing",
            callId: data.callId,
            chatRoomId: data.to,
            offer: data.from,
          });
          break;

        case "call:ended":
          handleEndCall(data.callId);
          break;

        case "call:answered":
          handleAnswer(data.answer);
          break;

        case "ice-candidate":
          handleIceCandidate(data.candidate)
          break
        default:
          break;
      }
    };

    socket?.on("callEvent", callEventHandler);

    return () => {
      socket?.off("callEvent");
    };
  }, [localStream, socket]);
  const handleEndCall = useCallback(
    (callId: string) => {
      console.log("Ending call:", callId);
      setActiveCalls((prev) => prev.filter((call) => call.callId !== callId));
      endCall();
    },
    [endCall]
  );

  return (
    <CommunicationContext.Provider
      value={{
        showNotification,
        showIncomingCall,
        initiateCall,
        handleAcceptCall,
        handleDeclineCall,
        handleEndCall,

        socket,
      }}
    >
      {children}
      {notifications.map((notification) => (
        <NotificationPopUp
          key={notification.notificationId}
          {...notification}
        />
      ))}
      {activeCalls.map((call) => (
        <Fragment key={call.callId}>
          {isMinimized ? (
            <MinimizedCall
              callSession={call}
              maximizeCallScreen={() => setIsMinimized(false)}
              isLocalUserCaller={call.caller.userId === currentUser?.userId}
            />
          ) : (
            <SingleCallUI
              remoteUser={{
                isSpeaking: true,
                profilePicture: call.caller.profilePicture,
                userId: call.caller.userId,
                username: call.caller.username,
              }}
              onEndCall={() => {
                handleEndCall(call.callId);
                setIsMinimized(true);
              }}
              minimizeCallScreen={() => setIsMinimized(true)}
              localStream={localStream}
              remoteStream={remoteStream}
            />
          )}
        </Fragment>
      ))}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

type IncomingCallEvent = {
  event: "call:incoming";
  data: {
    from: RTCSessionDescriptionInit;
    isVideo: boolean;
    to: string;
    caller: CallParticipant;
    callId: string;
  };
};
type CallAnsweredEvent = {
  event: "call:answered";
  data: {
    answer: RTCSessionDescriptionInit;
  };
};

type CallEndedEvent = {
  event: "call:ended";
  data: {
    callId: string;
  };
};

type ICECandidateEvent = {
  event: "ice-candidate";
  data: {
    candidate: RTCIceCandidate;
  };
};

type CallEvents =
  | IncomingCallEvent
  | CallAnsweredEvent
  | CallEndedEvent
  | ICECandidateEvent;
