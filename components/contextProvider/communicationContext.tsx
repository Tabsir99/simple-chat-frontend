"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
  status: 'initiating' | 'ringing' | 'connected' | 'ended';
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
  handleAcceptCall: (callId: string) => void;
  handleDeclineCall: (callId: string) => void;
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

  const { socket } = useSocketConnection(showNotification);
  const {
    createConnection,
    endCall,
    getUserMedia,
    handleAnswer,
    handleIceCandidate,
    handleIncomingCall,
    makeOutgoingCalls,
  } = useRTC(socket);

  const showIncomingCall = useCallback((callSession: CallSession) => {
    setActiveCalls((prev) => [...prev, { ...callSession, isOutgoing: false }]);
  }, []);

  const initiateCall = useCallback((callSession: CallSession) => {
    setActiveCalls((prev) => [...prev, { ...callSession, isOutgoing: true }]);
  }, []);

  const handleAcceptCall = useCallback((callId: string) => {
    console.log("Accepting call:", callId);
    setActiveCalls((prev) =>
      prev.map((call) =>
        call.callId === callId ? { ...call, status: "connected" } : call
      )
    );
  }, []);

  const handleDeclineCall = useCallback((callId: string) => {
    console.log("Declining call:", callId);
    setActiveCalls((prev) => prev.filter((call) => call.callId !== callId));
  }, []);

  const handleEndCall = useCallback((callId: string) => {
    console.log("Ending call:", callId);
    setActiveCalls((prev) => prev.filter((call) => call.callId !== callId));
  }, []);

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
        <>
          {isMinimized ? (
            <MinimizedCall
              key={call.callId}
              callId={call.callId}
              recipientName={call.recipientName}
              isVideoCall={call.isVideoCall}
              recipientProfilePicture={call.recipientAvatar || ""}
              isOutgoing={call.isOutgoing}
              maximizeCallScreen={() => setIsMinimized(false)}
            />
          ) : (
            <SingleCallUI
              remoteUser={{
                isSpeaking: true,
                profilePicture: "",
                userId: "1",
                username: "doe",
              }}
              onEndCall={() => {
                handleEndCall(call.callId);
                setIsMinimized(true);
              }}
              minimizeCallScreen={() => setIsMinimized(true)}
            />
          )}
        </>
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
