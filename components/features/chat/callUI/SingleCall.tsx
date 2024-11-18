import React, { useState, useEffect, useRef } from "react";
import { Camera, Minimize2 } from "lucide-react";
import { CallSession } from "@/types/ChatTypes/CallTypes";
import Avatar from "../../../shared/ui/atoms/profileAvatar/profileAvatar";
import CallControls from "./CallControls";
import CallRinging from "./CallRinging";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { formatDuration } from "@/utils/utils";

interface SingleCallProps {
  minimizeCallScreen: () => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callSession: CallSession;
  isLocalUserCaller: boolean;
}

const SingleCallUI = ({
  callSession,
  minimizeCallScreen,
  localStream,
  remoteStream,
  isLocalUserCaller,
}: SingleCallProps) => {
  const [showChatRoom, setShowChatRoom] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { user } = useAuth();

  const [showCallControls, setShowCallControls] = useState(true);
  const [isCameraSwitching, setIsCameraSwitching] = useState(false);

  const { recipients: remoteUsers, caller, status, isVideoCall } = callSession;

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const remoteParticipant = isLocalUserCaller ? remoteUsers[0] : caller;

  const AudioCallUI = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <Avatar
        avatarName={remoteParticipant.username}
        profilePicture={remoteParticipant.profilePicture}
        className="w-40 h-40 text-[60px] mb-8"
      />
      <h2 className="text-2xl font-semibold text-white mb-2">
        {remoteParticipant.username}
      </h2>
      {status === "connected" ? (
        <div className="flex flex-col items-center">
          <span className="text-green-400 text-lg mb-2">Call in progress</span>
          <CallDuration />
        </div>
      ) : (
        <span className="text-blue-400 text-lg">Calling...</span>
      )}
    </div>
  );

  return (
    <div
      onClick={() => setShowCallControls(!showCallControls)}
      className={`fixed inset-0 z-[999] bg-gradient-to-b transition-all duration-200 from-gray-900 to-gray-800 ${
        showChatRoom ? "md:w-[26rem] w-[400px]" : "w-full"
      }`}
    >
      <div
        className={`h-full flex flex-col relative transition-all duration-300 ${
          showCallControls ? "pb-[90px]" : ""
        }`}
      >
        <div className="absolute flex items-center w-full justify-end top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent z-10">
          <button
            onClick={minimizeCallScreen}
            className="p-2 rounded-full bg-gray-800/40 hover:bg-gray-700/40 transition-colors"
          >
            <Minimize2 className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="relative flex-grow overflow-hidden">
          {status === "ringing" ? (
            <CallRinging
              isVideoCall={isVideoCall}
              remoteParticipants={[remoteParticipant]}
              isOutgoing={caller.userId === user?.userId}
            />
          ) : (
            <>
              <div className="absolute inset-0">
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${
                      isVideoCall ? "" : "hidden"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <Avatar
                      avatarName={remoteParticipant.username}
                      profilePicture={remoteParticipant.profilePicture}
                      className="w-32 h-32 text-[50px]"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {isVideoCall || (status === "connected" && <AudioCallUI />)}

          {isVideoCall && localStream && (
            <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">
              {isCameraSwitching ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Camera className="w-8 h-8 text-white/70" />
                    <span className="text-xs text-white/70">
                      Switching camera...
                    </span>
                  </div>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </div>

        <CallControls
          setShowChatRoom={setShowChatRoom}
          showCallControls={showCallControls}
          showChatRoom={showChatRoom}
          localStream={localStream}
          remoteStream={remoteStream}
          setIsCameraSwitching={setIsCameraSwitching}
          callSession={callSession}
        />
      </div>
    </div>
  );
};

export default SingleCallUI;

export const CallDuration = () => {
  const [callDuration, setCallDuration] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateDuration = () => {
      setCallDuration((prev) => prev + 1);
      timeoutRef.current = setTimeout(updateDuration, 1000);
    };

    timeoutRef.current = setTimeout(updateDuration, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <span className="text-gray-300 text-sm border">
      {formatDuration(callDuration)}
    </span>
  );
};
