import React, { useEffect, useState } from "react";
import { Phone, PhoneOff, Clock, Video } from "lucide-react";
import { CallParticipant } from "@/components/shared/contexts/communication/communicationContext";
import { formatDuration } from "@/utils/utils";

interface CallEndScreenProps {
  remoteParticipant: CallParticipant;
  isVideoCall: boolean;
  onClose: () => void;
  callStart?: Date;
  callEnd?: Date;
}
const CallEndScreen = ({
  remoteParticipant,
  isVideoCall,
  onClose,
  callStart,
  callEnd,
}: CallEndScreenProps) => {
  const [isUnmounting, setIsUnmounting] = useState(false);

  useEffect(() => {
    const unmountTimer = setTimeout(() => {
      setIsUnmounting(true);
    }, 2700);

    const closeTimer = setTimeout(onClose, 3000);

    return () => {
      clearTimeout(unmountTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);
  return (
    <div
      className={`fixed inset-0 z-[999] bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-6
 transition duration-300 ${
   isUnmounting ? "opacity-0 scale-75 origin-bottom" : ""
 }
    `}
    >
      {/* Call ended indicator */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
          <PhoneOff className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-gray-200 text-xl font-semibold">Call Ended</h2>
      </div>

      {/* Call details */}
      <div className="bg-gray-800/50 rounded-2xl p-6 w-full max-w-sm mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden">
            {remoteParticipant.profilePicture ? (
              <img
                src={remoteParticipant.profilePicture}
                alt={remoteParticipant.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-medium">
                {remoteParticipant.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-gray-200 font-medium">
              {remoteParticipant.username}
            </h3>
            <div className="flex items-center gap-2 text-gray-400 mt-1">
              {isVideoCall ? (
                <Video className="w-4 h-4" />
              ) : (
                <Phone className="w-4 h-4" />
              )}
              <span className="text-sm">
                {isVideoCall ? "Video Call" : "Voice Call"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400 border-t border-gray-700 pt-4">
          <Clock className="w-4 h-4" />
          <span>
            Duration:{" "}
            {callStart && callEnd
              ? formatDuration((callEnd.getTime() - callStart.getTime()) / 1000)
              : "00:00"}{" "}
          </span>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={() => {
          setIsUnmounting(true);
          setTimeout(onClose, 300);
        }}
        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
      >
        Close
      </button>
    </div>
  );
};

export default CallEndScreen;
