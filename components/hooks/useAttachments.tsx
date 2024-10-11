import { useState, useRef } from 'react';
import type { Attachment } from '@/types/chatTypes';


export function useAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: File[]) => {
    const newAttachments: Attachment[] = await Promise.all(
      files.map(async (file) => {
        const type = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : "document"

        const url = type === "image" ? URL.createObjectURL(file) : "";

        return {
          file,
          url,
          type,
        };
      })
    );

    console.log(attachments)
    setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prevAttachments => {
      const newAttachments = [...prevAttachments];
      if (newAttachments[index].url) {
        URL.revokeObjectURL(newAttachments[index].url);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const clearAttachments = () => {
    attachments.forEach(attachment => {
      if (attachment.url) {
        URL.revokeObjectURL(attachment.url);
      }
    });
    setAttachments([]);
  };

  return {
    attachments,
    fileInputRef,
    handleFileSelect,
    removeAttachment,
    clearAttachments
  };
}