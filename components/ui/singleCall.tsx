import React, { useState, useEffect } from "react";
import {
  Mic,
  Video,
  Phone,
  Minimize2,
} from "lucide-react";
import { useAuth } from "../authComps/authcontext";

interface SingleCallProps {
  remoteUser: {
    userId: string;
    username: string;
    profilePicture: string | null;
    isSpeaking: boolean;
  };
  onEndCall: () => void;
  minimizeCallScreen: () => void;
}

const SingleCallUI = ({
  remoteUser,
  onEndCall,
  minimizeCallScreen,
}: SingleCallProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const { user: currentUser } = useAuth();
  const [startInterval, setStartInterval] = useState(false)

  // Handle call duration timer
  useEffect(() => {
    if(!startInterval) return

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [startInterval]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="h-full flex flex-col">
        {/* Main video area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Remote user's video (large) */}
          <div className="absolute inset-0">
            {remoteUser.profilePicture ? (
              <img
                src={remoteUser.profilePicture}
                alt={remoteUser.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <span className="text-8xl font-bold text-white opacity-50">
                  {remoteUser.username[0]}
                </span>
              </div>
            )}
          </div>

          {/* Call info overlay */}
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">
                  {remoteUser.username}
                </span>
                <span className="text-gray-300 text-sm">
                  {formatDuration(callDuration)}
                </span>
              </div>
              <button
                onClick={minimizeCallScreen}
                className="p-2 rounded-full bg-gray-800/40 hover:bg-gray-700/40 transition-colors"
              >
                <Minimize2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Local video (small) */}
          <div className="absolute bottom-24 right-6 w-48 aspect-video rounded-lg overflow-hidden shadow-lg">
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt="You"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-2xl font-bold text-white">
                  {currentUser?.username?.[0]}
                </span>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <span className="text-sm text-white">You</span>
            </div>
          </div>
        </div>

        {/* Control bar */}
        <div className="px-6 py-4 bg-gray-800/40 backdrop-blur-sm">
          <div className="max-w-md mx-auto flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all transform hover:scale-105 ${
                isMuted
                  ? "bg-red-500/20 text-red-500"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              <Mic className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsVideoPaused(!isVideoPaused)}
              className={`p-4 rounded-full transition-all transform hover:scale-105 ${
                isVideoPaused
                  ? "bg-red-500/20 text-red-500"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              <Video className="w-6 h-6" />
            </button>

            <button
              onClick={onEndCall}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-105"
            >
              <Phone className="w-6 h-6 rotate-225" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCallUI;
