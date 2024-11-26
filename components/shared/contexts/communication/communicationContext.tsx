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
import { useRTC } from "../../hooks/communication/useRTC";
import { useAuth } from "../auth/authcontext";
import { Socket, io } from "socket.io-client";
import { ecnf } from "@/utils/constants/env";
import { useNotification } from "../../hooks/common/useNotification";
import { useSocketConnection } from "../../hooks/communication/useSocket";

import SingleCallUI from "../../../features/chat/callUI/SingleCall";
import MinimizedCall from "@/components/shared/ui/organisms/popup/callNotification";
import CallEndScreen from "@/components/features/chat/callUI/CallEndScreen";
import IncomingCallModal from "@/components/features/chat/callUI/IncomingCall";
import {
  CallEvents,
  CallParticipant,
  CallSession,
  CommunicationContextType,
} from "@/types/ChatTypes/CallTypes";
import { useParams } from "next/navigation";

const NotificationPopUp = dynamic(
  () => import("@/components/shared/ui/organisms/popup/notificationPopup"),
  { ssr: false }
);

const CommunicationContext = createContext<
  CommunicationContextType | undefined
>(undefined);

export const CommunicationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { notifications, showNotification } = useNotification();

  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [incomingCalls, setIncomingCalls] = useState<CallSession[]>([]);

  const [isMinimized, setIsMinimized] = useState(false);
  const { user: currentUser } = useAuth();

  const chatRoomId = useParams().chatId as string;
  const { socket } = useSocketConnection(showNotification);
  const {
    endCall,
    handleAnswer,
    handleIceCandidate,
    handleIncomingCall,
    makeOutgoingCalls,
    switchCamera,
    localStream,
    remoteStream,
    pConnection,
  } = useRTC(socket);

  const showIncomingCall = useCallback(
    (callSession: CallSession) => {
      if (activeCall) {
        socket?.emit("decline-call", {
          callId: callSession.callId,
          to: callSession.chatRoomId,
          reason: "BUSY",
        });
        return;
      }
      setIncomingCalls((prev) => [
        ...prev,
        { ...callSession, isOutgoing: false },
      ]);
    },
    [activeCall, socket]
  );

  const initiateCall = useCallback(
    async (isVideoCall: boolean, recipient: CallParticipant) => {
      if (activeCall) {
        return showNotification(
          "Can't make call while in another call!",
          "warning"
        );
      }

      const callSession: CallSession = {
        callId: uuid4(),
        status: "ringing",
        caller: currentUser!,
        chatRoomId: chatRoomId,
        isVideoCall: isVideoCall,
        recipients: [recipient],
      };


      await makeOutgoingCalls(callSession);
      setActiveCall(callSession);
    },
    [currentUser, activeCall, makeOutgoingCalls]
  );

  const handleAcceptCall = useCallback(
    async (
      callId: string,
      offer: RTCSessionDescriptionInit,
      isVideo: boolean,
      chatRoomId: string
    ) => {
      incomingCalls.forEach((call) => {
        if (call.callId !== callId) {
          socket?.emit("decline-call", {
            callId,
            to: chatRoomId,
            reason: "BUSY",
          });
        }
      });

      setIncomingCalls([]);

      const accpetedCall = incomingCalls.find(
        (call) => call.callId === callId
      ) as CallSession;

      accpetedCall.status = "connected";
      setActiveCall(accpetedCall);

      const answer = await handleIncomingCall({
        isVideo: isVideo,
        offer: offer,
        chatRoomId: chatRoomId,
      });

      socket?.emit("call-answer", {
        answer,
        callId,
        to: chatRoomId,
      });
    },
    [socket, handleIncomingCall, incomingCalls]
  );

  const handleAbortCall = useCallback(
    (callId: string, to: string) => {
      if (activeCall) {
        setActiveCall({ ...activeCall, status: "ended" });
      }

      setIncomingCalls((prev) => prev.filter((call) => call.callId !== callId));
      endCall();
      socket?.emit("decline-call", {
        callId,
        to,
      });
    },
    [socket, endCall, activeCall]
  );

  const handleEndCall = useCallback(
    (callId: string, to: string) => {
      if (activeCall) {
        setActiveCall({ ...activeCall, status: "ended" });
      }
      endCall();

      socket?.emit("end-call", { callId, to });
    },
    [endCall, socket, activeCall]
  );

  useEffect(() => {
    const callEventHandler = async ({ event, data }: CallEvents) => {
      switch (event) {
        case "call:incoming":
          showIncomingCall({
            recipients: [currentUser!],
            caller: data.caller,
            isVideoCall: data.isVideoCall,
            status: "ringing",
            callId: data.callId,
            chatRoomId: data.to,
            offer: data.from,
          });
          break;

        case "call:ended":
          if (activeCall) {
            setActiveCall({ ...activeCall, status: "ended" });
          }
          setIncomingCalls((prev) =>
            prev.filter((call) => call.callId !== data.callId)
          );
          endCall();
          break;

        case "call:answered":
          try {
            await handleAnswer(data.answer);
            setActiveCall((prev) => {
              if (!prev) return prev;
              return { ...prev, status: "connected" };
            });
          } catch (error) {
            socket?.emit("call-failed", {
              callId: data.callId,
            });
          }
          break;

        case "ice-candidate":
          handleIceCandidate(data.candidate);
          break;
        default:
          break;
      }
    };

    socket?.on("callEvent", callEventHandler);

    return () => {
      socket?.off("callEvent");
    };
  }, [
    socket,
    endCall,
    activeCall,
    handleAnswer,
    handleIceCandidate,
    showIncomingCall,
    currentUser,
  ]);

  useEffect(() => {
    const peerConnection = pConnection.current;
    const handleConnectionChange = () => {
      if (peerConnection?.connectionState === "connected") {
        socket?.emit("call-connected", {
          callId: activeCall?.callId,
          to: activeCall?.chatRoomId,
        });
      }
    };
    if (peerConnection)
      peerConnection.addEventListener(
        "connectionstatechange",
        handleConnectionChange
      );

    return () => {
      peerConnection?.removeEventListener(
        "connectionstatechange",
        handleConnectionChange
      );
    };
  }, [socket, activeCall]);

  return (
    <CommunicationContext.Provider
      value={{
        showNotification,
        showIncomingCall,
        initiateCall,
        handleAcceptCall,
        handleAbortCall,
        handleEndCall,
        switchCamera,

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

      {incomingCalls.length > 0 && (
        <IncomingCallModal
          call={incomingCalls[0]}
          onAccept={() => {
            handleAcceptCall(
              incomingCalls[0].callId,
              incomingCalls[0].offer!,
              incomingCalls[0].isVideoCall,
              incomingCalls[0].chatRoomId
            );
          }}
          onDecline={() => {
            handleAbortCall(
              incomingCalls[0].callId,
              incomingCalls[0].chatRoomId
            );
          }}
        />
      )}

      {activeCall ? (
        activeCall.status === "ended" ? (
          <CallEndScreen
            isVideoCall={activeCall.isVideoCall}
            onClose={() => {
              setActiveCall(null);
            }}
            remoteParticipant={activeCall.recipients[0]}
            callEnd={activeCall.endTime}
            callStart={activeCall.startTime}
          />
        ) : (
          <Fragment key={activeCall.callId}>
            {isMinimized ? (
              <MinimizedCall
                callSession={activeCall}
                maximizeCallScreen={() => setIsMinimized(false)}
                isLocalUserCaller={
                  activeCall.caller.userId === currentUser?.userId
                }
              />
            ) : (
              <SingleCallUI
                callSession={activeCall}
                minimizeCallScreen={() => setIsMinimized(true)}
                localStream={localStream}
                remoteStream={remoteStream}
                isLocalUserCaller={
                  activeCall.caller.userId === currentUser?.userId
                }
              />
            )}
          </Fragment>
        )
      ) : null}
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
