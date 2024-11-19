import React from "react";
import { Phone, Video, PhoneOff, Clock } from "lucide-react";
import { CallInformation } from "@/types/chatTypes";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { formatDate } from "@/utils/utils";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { CallParticipant } from "@/types/ChatTypes/CallTypes";

const formatDuration = (startTime: string | null, endTime: string | null) => {
  if (!startTime) return "";
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime) : new Date();
  const diff = Math.floor((end.getTime() - start) / 1000);

  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  console.log("time formated", minutes, seconds);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const CallMessage = ({
  callInfo,
  messageTime,
  recipient,
  messageId,
}: {
  callInfo: CallInformation;
  messageTime: string;
  recipient: CallParticipant;
  messageId: string;
}) => {
  const { callerId, isVideoCall, startTime, endTime, status } = callInfo;
  const isCurrentUserCaller = callerId === useAuth().user?.userId;

  const { initiateCall } = useCommunication();
  const getStatusColor = () => {
    switch (status) {
      case "ongoing":
        return "text-green-400";
      case "ended":
        return "text-gray-400";
      case "missed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getHeaderText = () => {
    switch (status) {
      case "missed":
        if (isCurrentUserCaller) {
          return isVideoCall ? "Video call" : "Voice call";
        } else {
          return isVideoCall ? "Missed video call" : "Missed voice call";
        }
      case "ended":
        return isVideoCall ? "Video call" : "Voice call";
      case "ongoing":
        return isVideoCall ? "Ongoing video call" : "Ongoing voice call";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "missed":
        return "Call not answered";
      case "ended":
        const duration = formatDuration(startTime, endTime);
        return duration;
    }
  };
  return (
    <div
      className={`bg-gray-700 bg-opacity-30 rounded-lg pt-4 pb-3 px-4 w-[380px] max-sm:w-[320px] shadow-lg  ${
        isCurrentUserCaller ? "self-end" : "self-start"
      }`}
      id={messageId}
    >
      <div className="flex items-center gap-3 px-2 max-sm:px-0">
        <div
          className={`p-3 rounded-full ${
            status === "ongoing" ? "bg-green-500/10" : "bg-gray-700"
          }`}
        >
          {isVideoCall ? (
            <Video
              className={`w-6 h-6 max-sm:w-5 max-sm:h-5 ${getStatusColor()}`}
            />
          ) : (
            <Phone
              className={`w-6 h-6 max-sm:w-5 max-sm:h-5 ${getStatusColor()}`}
            />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-gray-100 font-medium flex items-center justify-between gap-16 max-sm:text-[16px] ">
            {getHeaderText()}{" "}
            <span className="text-[13px] text-gray-300">
              {" "}
              {formatDate(messageTime)}{" "}
            </span>{" "}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm max-sm:text-[16px] ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {status === "ongoing" && (
        <button className="mt-3 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors">
          <PhoneOff className="w-4 h-4" />
          <span>End Call</span>
        </button>
      )}

      {status === "missed" ? (
        <button
          onClick={() => {
            initiateCall(isVideoCall, recipient);
          }}
          className="mt-3 w-full bg-gray-700 bg-opacity-40 hover:bg-opacity-80 transition duration-300 py-2 rounded-md max-sm:text-[16px] flex items-center justify-center gap-3"
        >
          {isVideoCall ? (
            <Video className="w-4 h-4" />
          ) : (
            <Phone className="w-4 h-4" />
          )}
          <span>{isCurrentUserCaller ? "Call again" : "Call back"}</span>
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default CallMessage;
