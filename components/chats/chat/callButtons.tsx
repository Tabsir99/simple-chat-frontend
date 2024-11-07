import React from "react";
import { Phone, Video, LucideIcon } from "lucide-react";
import { v4 as uuid4 } from "uuid";
import {
  CallParticipant,
  useCommunication,
} from "@/components/contextProvider/communicationContext";
import { useParams } from "next/navigation";

interface CallButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "accept" | "decline";
}

interface CallControlsProps {
  localUser: CallParticipant;
  recipient: CallParticipant;
}

const CallButton: React.FC<CallButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}) => {
  const baseStyles =
    "relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300";
  const variantStyles = {
    default:
      "bg-gray-800/90 hover:bg-gray-700 border border-gray-700/50 hover:border-gray-600",
    accept:
      "bg-green-600/90 hover:bg-green-500 border border-green-500/50 hover:border-green-400",
    decline:
      "bg-red-600/90 hover:bg-red-500 border border-red-500/50 hover:border-red-400",
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          hover:scale-110
          hover:shadow-lg hover:shadow-${
            variant === "default"
              ? "gray"
              : variant === "accept"
              ? "green"
              : "red"
          }-500/20
          backdrop-blur-sm
        `}
        aria-label={label}
      >
        <Icon className="w-5 h-5 text-white" />
      </button>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-xs font-medium text-gray-200 bg-gray-800/90 px-2 py-1 rounded-md whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
};

const CallControls: React.FC<CallControlsProps> = ({
  localUser,
  recipient,
}) => {
  const { initiateCall } = useCommunication();

const chatRoomId = useParams().chatId

  const handleCall = (isVideo: boolean) => {
    const callSession = {
      callId: uuid4(),
      caller: localUser,
      recipient: recipient,
      isVideoCall: isVideo,
      status: "initiating" as const,
      chatRoomId: chatRoomId as string,
      startTime: new Date(),
    };

    initiateCall(callSession);
  };

  return (
    <div className="flex items-center gap-3 p-2">
      <CallButton
        icon={Phone}
        label="Voice Call"
        onClick={() => handleCall(false)}
        variant="default"
      />
      <CallButton
        icon={Video}
        label="Video Call"
        onClick={() => handleCall(true)}
        variant="default"
      />
    </div>
  );
};

export default CallControls;
