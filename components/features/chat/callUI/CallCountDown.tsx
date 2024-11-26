import { CallParticipant } from "@/types/ChatTypes/CallTypes";
import { Phone, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CallCountdownProps {
  isVideoCall: boolean;
  remoteUser: CallParticipant;
  onCountdownComplete: () => void;
  onCancel: () => void;
}
const CallCountdown = ({
  isVideoCall = false,
  remoteUser,
  onCountdownComplete,
  onCancel,
}: CallCountdownProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (count > 0) {
      timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      onCountdownComplete();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [count, onCountdownComplete]);

  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center">
      {/* Pulsing circle animation */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{count}</span>
        </div>
      </div>

      {/* Call type indicator */}
      <div className="mt-8 flex items-center gap-3">
        {isVideoCall ? (
          <Video className="w-6 h-6 text-blue-400" />
        ) : (
          <Phone className="w-6 h-6 text-blue-400" />
        )}
        <span className="text-xl text-white">
          Starting {isVideoCall ? "Video" : "Voice"} Call
        </span>
      </div>

      {/* User info */}
      <div className="mt-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
          {remoteUser?.profilePicture ? (
            <Image
              src={remoteUser.profilePicture}
              alt={remoteUser.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-white font-medium">
              {remoteUser?.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="mt-4 text-xl text-white font-medium">
          {remoteUser?.username}
        </h2>
        <p className="text-gray-400 mt-1">
          Starting {isVideoCall ? "video" : "voice"} call...
        </p>
      </div>

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="mt-12 px-6 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};

export default CallCountdown;
