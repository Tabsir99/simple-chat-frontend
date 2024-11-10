import { useState, useRef } from "react";
import type { AttachmentViewModel } from "@/types/chatTypes";



export function useAttachments() {
  const [attachment, setAttachment] = useState<AttachmentViewModel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {

    const url = URL.createObjectURL(file);

    setAttachment({
      fileType: file.type as AttachmentViewModel["fileType"],
      fileName: file.name,
      fileSize: file.size,
      fileUrl: url,
      file: file
    });
  };

  const clearAttachments = () => {
    if (attachment) {
      URL.revokeObjectURL(attachment.fileUrl);
    }
    setAttachment(null);
  };

  return {
    attachment,
    fileInputRef,
    handleFileSelect,
    clearAttachments,
  };
}
