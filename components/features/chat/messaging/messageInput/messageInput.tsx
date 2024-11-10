import { IChatHead, IMessage, AttachmentViewModel } from "@/types/chatTypes";
import { useAttachments } from "@/components/shared/hooks/chat/useAttachments";
import FilePreview from "../../attachments/attachmentPreview";
import MessageInputForm from "@/components/features/chat/messaging/messageInput/inputForm";
import ReplyPreview from "@/components/features/chat/messaging/messageInput/replyPreview";

export default function MessageInput({
  sendMessage,
  replyingTo = null,
  onCancelReply = () => {},
  selectedActiveChat,
  attachmentsMap,
}: {
  sendMessage: (attachments: any, newMessage: string) => void;
  replyingTo?: IMessage | null;
  onCancelReply?: () => void;
  selectedActiveChat: IChatHead | undefined;
  attachmentsMap: Map<string, AttachmentViewModel>;
}) {
  const { attachment, fileInputRef, handleFileSelect, clearAttachments } =
    useAttachments();

    
  return (
    <div
      className="px-0 flex flex-col justify-center items-stretch 
      border-gray-400 relative "
    >
      {replyingTo && (
        <ReplyPreview
          replyingTo={replyingTo}
          attachmentsMap={attachmentsMap}
          onCancelReply={onCancelReply}
        />
      )}
      {attachment && (
        <FilePreview
          attachment={attachment}
          clearAttachments={clearAttachments}
        />
      )}

      <MessageInputForm
        sendMessage={sendMessage}
        attachment={attachment}
        clearAttachments={clearAttachments}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
      />
    </div>
  );
}
