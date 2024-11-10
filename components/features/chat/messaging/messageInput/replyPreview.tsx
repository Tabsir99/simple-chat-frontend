import { X } from "lucide-react";
import { GrAttachment } from "react-icons/gr";
import { formatDate } from "@/utils/utils";
import { AttachmentViewModel, IMessage } from "@/types/chatTypes";

interface ReplyPreviewProps {
  replyingTo: IMessage;
  onCancelReply: () => void;
  attachmentsMap: Map<string, AttachmentViewModel>;
}

const ReplyPreview = ({ replyingTo, onCancelReply, attachmentsMap }: ReplyPreviewProps) => {
  return (
    <div className="flex items-center absolute -top-16 left-0 border-2 border-gray-700 z-30 gap-3 px-4 py-3 bg-gray-800 rounded-lg shadow-lg max-w-[90%] transition-all duration-500">
      {replyingTo.sender?.profilePicture ? (
        <img
          src={replyingTo.sender.profilePicture}
          alt={replyingTo.sender.username}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
      ) : (
        <span className="uppercase font-bold text-xs flex justify-center items-center bg-gray-700 bg-opacity-60 w-10 h-10 rounded-full">
          {replyingTo.sender?.username.charAt(0)}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-300 mb-1">
          Replying to {replyingTo.sender?.username}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {replyingTo.content.length > 50
            ? `${replyingTo.content.substring(0, 50)}...`
            : replyingTo.content}
          {replyingTo.isEdited && (
            <span className="text-gray-500 ml-2">(edited)</span>
          )}
        </div>
        {attachmentsMap.has(replyingTo.messageId) && (
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <GrAttachment size={18} />
            Attachment
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 ml-2">
        {formatDate(replyingTo.createdAt)}
      </div>

      <button
        onClick={onCancelReply}
        className="text-gray-400 hover:text-white ml-2"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ReplyPreview