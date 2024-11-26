import React, { useEffect, useState } from "react";
import { Phone, Video, X, User2, Maximize2 } from "lucide-react";
import {
  useCommunication,
} from "../../../contexts/communication/communicationContext";
import { CallSession } from "@/types/ChatTypes/CallTypes";
import Image from "next/image";

interface MinimizedCallProps {
  callSession: CallSession;
  isLocalUserCaller: boolean;
  maximizeCallScreen: () => void;
}

const MinimizedCall: React.FC<MinimizedCallProps> = ({
  callSession,
  isLocalUserCaller,
  maximizeCallScreen,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { handleAcceptCall, handleAbortCall, handleEndCall } =
    useCommunication();

  const { caller, recipients, isVideoCall, callId, chatRoomId, offer,status } =
    callSession;
  const remoteParticipant = isLocalUserCaller ? recipients[0] : caller;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        fixed top-2 left-2 right-2 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[999]
        transition-all duration-500 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}
      `}
    >
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-3 md:p-4 w-full md:w-[400px]">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Profile Picture */}
          {remoteParticipant.profilePicture ? (
            <Image
              src={remoteParticipant.profilePicture}
              alt={remoteParticipant.username}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-800"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-gray-600 ring-offset-2 ring-offset-gray-800">
              <User2 className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
            </div>
          )}

          {/* Call Info */}
          <div className="flex flex-col flex-grow min-w-0">
            <span className="text-base md:text-lg font-semibold text-white tracking-tight truncate">
              {remoteParticipant.username}
            </span>
            <span className="text-xs md:text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
              {isVideoCall ? (
                <Video className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
              )}
              <span>{isLocalUserCaller ? "Calling..." : "Incoming Call"}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if(status === "ringing"){
                  handleAbortCall(callId,chatRoomId)
                }
                if(status === "connected"){
                  handleEndCall(callId,chatRoomId)
                }
              }}
              className="p-2 md:p-3 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-200"
              aria-label="Decline call"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            {isLocalUserCaller || (
              <button
                onClick={() =>
                  handleAcceptCall(callId, offer!, isVideoCall, chatRoomId)
                }
                className="p-2 md:p-3 rounded-full bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white transition-all duration-200 animate-pulse"
                aria-label="Accept call"
              >
                {isVideoCall ? (
                  <Video className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            )}
            <button
              onClick={maximizeCallScreen}
              className="p-2 md:p-3 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200"
              aria-label="Maximize call"
            >
              <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimizedCall;
