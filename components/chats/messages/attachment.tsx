import { FileIcon, Download, PlayCircle } from "lucide-react";
import { AttachmentViewModel } from "@/types/chatTypes";
import { useState } from "react";
import VideoPlayer from "./attachments/videoPlayer";
import AudioPlayer from "./attachments/audioPlayer";

interface AttachmentsProps {
  attachments: AttachmentViewModel;
}

const Attachments = ({ attachments }: AttachmentsProps) => {
  if(!attachments.fileUrl) return null

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileCategory = (
    fileType: AttachmentViewModel["fileType"]
  ): "image" | "video" | "audio" | "document" | null => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("video/")) return "video";
    if (fileType.startsWith("audio/")) return "audio";
    if (fileType.startsWith("application/") || fileType.startsWith("text/"))
      return "document";
    return null;
  };

  const fileCategory = getFileCategory(attachments.fileType);

  return (
    <div className="mt-2 space-y-2 w-full flex flex-col">
      <div className="rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
        {fileCategory === "image" && (
          <img
            src={attachments.fileUrl}
            alt={attachments.fileName || "Image attachment"}
            className="max-w-full h-auto rounded-lg"
            loading="lazy"
          />
        )}

        {fileCategory === "video" && (
          <VideoPlayer attachments={attachments} />
        )}

        {fileCategory === "audio" && (
            <AudioPlayer src={attachments.fileUrl} />
        )}

        {fileCategory === "document" && (
          <button
            className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors"
            draggable="false"
            onClick={() => {
              fetch(attachments.fileUrl)
                .then((response) => response.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = attachments.fileName; // Set your filename
                  link.click();
                });
            }}
          >
            <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {attachments.fileName || attachments.fileUrl}
              </p>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400">
                {formatFileSize(attachments.fileSize)}
              </p>
            </div>
            <Download className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Attachments;
