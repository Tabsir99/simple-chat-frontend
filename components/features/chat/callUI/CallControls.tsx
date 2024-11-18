import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { CallSession } from "@/types/ChatTypes/CallTypes";
import {
  Camera,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  PhoneIncoming,
  Video,
  VideoOff,
  Volume2Icon,
  VolumeOff,
} from "lucide-react";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";

interface CallControlsProps {
  showCallControls: boolean;
  setShowChatRoom: Dispatch<SetStateAction<boolean>>;
  showChatRoom: boolean;

  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  setIsCameraSwitching: Dispatch<SetStateAction<boolean>>;

  callSession: CallSession;
}
export default function CallControls({
  setShowChatRoom,
  showCallControls,
  showChatRoom,
  localStream,
  remoteStream,
  setIsCameraSwitching,

  callSession: { callId, chatRoomId, status },
}: CallControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isMicOff, setIsMicOff] = useState(false);
  const callControlRef = useRef<HTMLDivElement | null>(null);

  const { handleAbortCall, handleEndCall, switchCamera } = useCommunication();

  return (
    <div
      ref={callControlRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`
          ${showCallControls ? "" : "translate-y-full scale-50"}
           px-6 py-3 h-[90px] bg-gray-700/25 backdrop-blur-lg border-t absolute bottom-4 left-1/2 -translate-x-1/2 border-white/5 transition duration-300
           border border-gray-700 rounded-full max-sm:py-2 max-sm:px-3 max-sm:h-[75px] flex items-center `}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
        <ControlButton
          onClick={() => {
            setIsVideoPaused(!isVideoPaused);
            localStream
              ?.getVideoTracks()
              .forEach((track) => (track.enabled = isVideoPaused));
          }}
          isActive={isVideoPaused}
          icon={Video}
          activeIcon={VideoOff}
        />
        <ControlButton
          onClick={() => {
            setIsMicOff(!isMicOff);
            localStream
              ?.getAudioTracks()
              .forEach((track) => (track.enabled = isMicOff));
          }}
          isActive={isMicOff}
          icon={Mic}
          activeIcon={MicOff}
        />

        {window.innerWidth > 600 ? (
          <ControlButton
            onClick={() => setShowChatRoom(!showChatRoom)}
            icon={MessageCircle}
            isActive={false}
          />
        ) : (
          <ControlButton
            icon={Camera}
            onClick={async () => {
              setIsCameraSwitching(true);
              await switchCamera();
              setIsCameraSwitching(false);
            }}
          />
        )}

        <ControlButton
          icon={Volume2Icon}
          activeIcon={VolumeOff}
          isActive={isMuted}
          onClick={() => {
            setIsMuted(!isMuted);
            remoteStream
              ?.getAudioTracks()
              .forEach((track) => (track.enabled = isMuted));
          }}
        />

        <ControlButton
          onClick={() => {
            if (status === "ringing") {
              handleAbortCall(callId, chatRoomId);
            }
            if (status === "connected") {
              handleEndCall(callId, chatRoomId);
            }
          }}
          icon={Phone}
          isActive={false}
          variant="danger"
        />
      </div>
    </div>
  );
}
interface ControlButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "danger" | "success";
}

const ControlButton = ({
  onClick,
  isActive,
  icon: Icon,
  activeIcon: ActiveIcon = Icon,
  variant = "default",
}: ControlButtonProps) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div
      className={`p-3 max-sm:p-2 rounded-full transition-all transform group-hover:scale-105 duration-200 ${
        variant === "danger"
          ? "bg-red-500 text-white hover:bg-red-600 bg-opacity-80"
          : variant === "success"
          ? "bg-green-500 text-white hover:bg-green-600 bg-opacity-80"
          : isActive
          ? "text-red-500"
          : "bg-transparent hover:bg-gray-500 hover:bg-opacity-20"
      }`}
    >
      {isActive ? (
        <ActiveIcon className="w-6 h-6 max-sm:w-5 max-sm:h-5 " />
      ) : (
        <Icon className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
      )}
    </div>
  </button>
);
