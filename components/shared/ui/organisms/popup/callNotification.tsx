import React, { useEffect, useState } from "react";
import { Phone, Video, X, User2, Maximize2 } from "lucide-react";
import {
  CallSession,
  useCommunication,
} from "../../../contexts/communication/communicationContext";
import { useParams } from "next/navigation";

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
  const { handleAcceptCall, handleDeclineCall, handleEndCall } =
    useCommunication();

  const { caller, recipient, isVideoCall, callId, chatRoomId, offer } =
    callSession;
  const remoteParticipant = isLocalUserCaller ? recipient : caller;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[999] 
        transition-all duration-500 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}
      `}
    >
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 px-8 py-5 min-w-[360px]">
        <div className="flex items-center gap-6">
          {/* Profile Picture */}
          {remoteParticipant.profilePicture ? (
            <img
              src={remoteParticipant.profilePicture}
              alt={remoteParticipant.username}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-800"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-gray-600 ring-offset-2 ring-offset-gray-800">
              <User2 className="w-7 h-7 text-gray-300" />
            </div>
          )}

          {/* Call Info */}
          <div className="flex flex-col flex-grow">
            <span className="text-lg font-semibold text-white tracking-tight">
              {remoteParticipant.username}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
              {isVideoCall ? (
                <Video className="w-4 h-4" />
              ) : (
                <Phone className="w-4 h-4" />
              )}
              <span>{isLocalUserCaller ? "Calling..." : "Incoming Call"}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isLocalUserCaller ? (
              <>
                <button
                  onClick={maximizeCallScreen}
                  className="p-3 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="Maximize call"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEndCall(callId)}
                  className="p-3 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="End call"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleDeclineCall(callId, chatRoomId);
                  }}
                  className="p-3 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="Decline call"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleAcceptCall(callId, offer!, isVideoCall, chatRoomId)}
                  className="p-3 rounded-full bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white transition-all duration-200 hover:scale-105 animate-pulse"
                  aria-label="Accept call"
                >
                  {isVideoCall ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={maximizeCallScreen}
                  className="p-3 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="Maximize call"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimizedCall;
