
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import { CallSession } from "@/types/ChatTypes/CallTypes";
import { HiXMark, HiPhoneArrowUpRight } from "react-icons/hi2";

interface IncomingCallModalProps {
  call: CallSession;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal = ({
  call,
  onAccept,
  onDecline,
}: IncomingCallModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-800 rounded-3xl p-8 w-[360px] flex flex-col items-center gap-6 shadow-xl">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/30 rounded-full animate-pulse" />
          <div className="relative z-10">
            <Avatar
              avatarName={call.caller.username}
              profilePicture={call.caller.profilePicture}
              className="w-28 h-28"
            />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-white text-2xl font-medium">
            {call.caller.username}
          </h2>
          <p className="text-gray-400 text-sm">
            {call.isVideoCall ? "Video Call" : "Voice Call"}
          </p>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <button
            onClick={onDecline}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center 
                       transition-transform transform hover:scale-110 active:scale-95"
            aria-label="Decline call"
          >
            <HiXMark className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center 
                       transition-transform transform hover:scale-110 active:scale-95"
            aria-label="Accept call"
          >
            <HiPhoneArrowUpRight className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
