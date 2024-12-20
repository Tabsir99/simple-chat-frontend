import React, { useState } from "react";
import { Phone, Video, LucideIcon } from "lucide-react";
import { v4 as uuid4 } from "uuid";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { useParams } from "next/navigation";
import CallCountdown from "../../callUI/CallCountDown";
import { CallParticipant } from "@/types/ChatTypes/CallTypes";

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
    "relative group flex items-center justify-center p-3 max-xs:p-2 rounded-full transition-all duration-300";
  const variantStyles = {
    default: " hover:bg-gray-700 xs:border-gray-700 xs:border ",
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
          backdrop-blur-sm
        `}
        aria-label={label}
      >
        <Icon className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
};

const CallControls: React.FC<CallControlsProps> = ({
  localUser,
  recipient,
}) => {
  const { initiateCall } = useCommunication();

  const [showCallCountDown, setShowCallCountDown] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const handleCall = (isVideo: boolean) => {
    setIsVideoCall(isVideo);
    setShowCallCountDown(true);
  };

  const startCallSession = () => {
    initiateCall(isVideoCall, recipient);
    setShowCallCountDown(false);
  };

  return (
    <>
      {showCallCountDown && (
        <CallCountdown
          isVideoCall={isVideoCall}
          onCancel={() => setShowCallCountDown(false)}
          onCountdownComplete={startCallSession}
          remoteUser={recipient}
        />
      )}
      <div className="flex items-center gap-2 p-2 max-xs:gap-0 max-xs:p-0">
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
    </>
  );
};

export default CallControls;
