import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Video,
  Phone,
  Minimize2,
  MicOff,
  VideoOff,
  MessageCircle,
  Settings,
  Users,
  Share2,
  LucideIcon,
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
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

interface ControlButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
  activeIcon?: LucideIcon;
  label: string;
  variant?: "default" | "danger";
}

const SingleCallUI = ({
  remoteUser,
  onEndCall,
  minimizeCallScreen,
  localStream,
  remoteStream,
}: SingleCallProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const { user: currentUser } = useAuth();
  const [startInterval, setStartInterval] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    if (!startInterval) return;

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

  const ControlButton = ({
    onClick,
    isActive,
    icon: Icon,
    activeIcon: ActiveIcon = Icon,
    label,
    variant = "default",
  }: ControlButtonProps) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
    >
      <div
        className={`p-3 rounded-full transition-all transform group-hover:scale-105 ${
          variant === "danger"
            ? "bg-red-500 text-white hover:bg-red-600"
            : isActive
            ? "bg-red-500/20 text-red-500"
            : "bg-gray-700/80 text-white hover:bg-gray-600/80"
        }`}
      >
        {isActive ? (
          <ActiveIcon className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>
      <span className="text-xs text-gray-300">{label}</span>
    </button>
  );

  return (
    <div
      className={`fixed inset-0 z-[999] bg-gradient-to-b from-gray-900 to-gray-800 ${
        showChatRoom ? " md:w-[26rem] w-[400px] " : ""
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {remoteUser.isSpeaking && (
                  <div className="absolute -inset-1 bg-green-500/20 rounded-full animate-pulse" />
                )}
                {remoteUser.profilePicture ? (
                  <img
                    src={remoteUser.profilePicture}
                    alt={remoteUser.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {remoteUser.username[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">
                  {remoteUser.username}
                </span>
                <span className="text-gray-300 text-sm">
                  {formatDuration(callDuration)}
                </span>
              </div>
            </div>
            <button
              onClick={minimizeCallScreen}
              className="p-2 rounded-full bg-gray-800/40 hover:bg-gray-700/40 transition-colors"
            >
              <Minimize2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main video area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Remote user's video */}
          <div className="absolute inset-0">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : remoteUser.profilePicture ? (
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

          {/* Local video */}
          <div className="absolute bottom-28 right-6 w-48 aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">
            {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt="You"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700/50">
                <span className="text-2xl font-bold text-white">
                  {currentUser?.username?.[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Control bar */}
        <div className="px-6 py-3 bg-gray-900/90 backdrop-blur-lg border-t border-white/5">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-6">
            <ControlButton
              onClick={() => setIsMuted(!isMuted)}
              isActive={isMuted}
              icon={Mic}
              activeIcon={MicOff}
              label="Mute"
            />

            <ControlButton
              onClick={() => setIsVideoPaused(!isVideoPaused)}
              isActive={isVideoPaused}
              icon={Video}
              activeIcon={VideoOff}
              label="Video"
            />

            <ControlButton
              onClick={onEndCall}
              icon={Phone}
              isActive={false}
              label="End"
              variant="danger"
            />

            <ControlButton
              onClick={() => setShowChatRoom(!showChatRoom)}
              icon={MessageCircle}
              isActive={false}
              label="Chat"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCallUI;
