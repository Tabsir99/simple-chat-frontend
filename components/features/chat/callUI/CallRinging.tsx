
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import { CallParticipant } from "@/types/ChatTypes/CallTypes";
import { Phone, Video } from "lucide-react";

export default function CallRinging({
  isVideoCall,
  remoteParticipants,
  isOutgoing,
}: {
  isVideoCall: boolean;
  remoteParticipants: CallParticipant[];
  isOutgoing: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {remoteParticipants.length === 1 ? (
        <>
          <div className="relative w-32 h-32">
            <Avatar
              avatarName={remoteParticipants[0].username}
              profilePicture={remoteParticipants[0].profilePicture}
              className="w-full h-full text-[40px]"
            />
          </div>

          <div className="mt-8 flex items-center gap-3">
            {isVideoCall ? (
              <Video className="w-6 h-6 text-blue-400" />
            ) : (
              <Phone className="w-6 h-6 text-blue-400" />
            )}
            <span className="text-lg text-white font-medium">
              {isVideoCall ? "Video" : "Voice"} Call
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <h2 className="text-xl text-white font-medium">
              {remoteParticipants[0].username}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <p className="text-blue-400">
                {isOutgoing ? "Calling..." : "Incoming call..."}
              </p>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
