import React from "react";
import { Video, AudioLines, FileText, X, Play } from "lucide-react";
import { AttachmentViewModel } from "@/types/chatTypes";

const FilePreview = ({
  attachment,
  clearAttachments,
}: {
  attachment: AttachmentViewModel;
  clearAttachments: () => void;
}) => {
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderPreview = () => {
    if (attachment.fileType.startsWith("image")) {
      return (
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName}
          className="w-full h-20 object-cover rounded"
        />
      );
    }

    if (attachment.fileType.startsWith("video")) {
      return (
        <div className=" rounded-md overflow-hidden relative">
            <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-1 rounded-full bg-opacity-70" size={35} />
          <video src={attachment.fileUrl} height={200} width={300} />
        </div>
      );
    }

    if (attachment.fileType.startsWith("audio")) {
      return (
        <div className=" rounded p-3 flex items-center space-x-3 justify-self-start bg-gray-800 border-2 border-gray-700">
          <div className="bg-gray-700 p-2 rounded-full">
            <AudioLines className="w-6 h-6 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {attachment.fileName}
            </p>
            <div className="flex items-center text-sm text-gray-400 space-x-2">
              <span>{formatFileSize(attachment.fileSize)}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Audio</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className=" rounded p-3 flex items-center space-x-3">
        <div className="bg-gray-700 p-2 rounded-full">
          <FileText className="w-6 h-6 text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate">
            {attachment.fileName}
          </p>
          <p className="text-sm text-gray-400">
            {formatFileSize(attachment.fileSize)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className=" w-fit min-h-[200px] -top-20 relative  rounded px-1 py-2 flex flex-col-reverse items-center gap-2 active:scale-95 transition-transform duration-200">
      {renderPreview()}

      <button
        onClick={() => clearAttachments()}
        className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 rounded-full p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default FilePreview;
