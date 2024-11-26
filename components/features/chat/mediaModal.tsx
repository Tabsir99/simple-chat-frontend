import React, { useState } from "react";
import {
  XCircle,
  Image,
  FileAudio,
  FileVideo,
  File,
  Download,
  X,
} from "lucide-react";
import useCustomSWR from "@/components/shared/hooks/common/customSwr";
import { ecnf } from "@/utils/constants/env";
import { AttachmentViewModel } from "@/types/chatTypes";
import { useChatContext } from "@/components/shared/contexts/chat/chatContext";

interface MediaItemProps {
  type: "image" | "audio" | "video" | "document";
  url: string;
  name: string;
  onPreview: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  type,
  url,
  name,
  onPreview,
}) => {
  const getIcon = () => {
    switch (type) {
      case "image":
        return <Image size={48} className="text-blue-400" />;
      case "audio":
        return <FileAudio size={48} className="text-green-400" />;
      case "video":
        return <FileVideo size={48} className="text-purple-400" />;
      default:
        return <File size={48} className="text-orange-400" />;
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={type !== "document" ? onPreview : undefined}
      className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200 border border-gray-700 cursor-pointer hover:bg-opacity-70 relative group"
    >
      {getIcon()}
      <span className="mt-2 text-sm text-gray-300 truncate w-full text-center">
        {name}
      </span>
      <button
        onClick={handleDownload}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 p-1 rounded-full hover:bg-gray-600"
      >
        <Download size={16} className="text-gray-300" />
      </button>
    </div>
  );
};

interface PreviewModalProps {
  item: AttachmentViewModel | null;
  onClose: () => void;
  fileCategory: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  item,
  onClose,
  fileCategory,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X size={24} />
      </button>
      <div className="max-w-4xl max-h-[90vh] w-full overflow-hidden">
        {fileCategory === "image" && (
          <img
            src={item.fileUrl}
            alt={item.fileName}
            className="max-w-full max-h-[90vh] object-contain"
          />
        )}
        {fileCategory === "video" && (
          <video controls className="max-w-full max-h-[90vh]">
            <source src={item.fileUrl} />
            Your browser does not support the video tag.
          </video>
        )}
        {fileCategory === "audio" && (
          <audio controls className="w-full">
            <source src={item.fileUrl} />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>
    </div>
  );
};

interface MediaModalProps {
  toggleMediaModal: () => void;
  selectedChatId: string;
}

export default function MediaModal({
  toggleMediaModal,
  selectedChatId,
}: MediaModalProps): JSX.Element {
  const [previewItem, setPreviewItem] = useState<AttachmentViewModel | null>(
    null
  );
  const { getFileCategory } = useChatContext();

  const { data } = useCustomSWR<AttachmentViewModel[]>(
    `${ecnf.apiUrl}/chats/${selectedChatId}/media?url=true`
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex h-[100dvh] items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-4xl min-h-[90dvh] overflow-hidden flex flex-col shadow-lg border border-gray-800">
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-blue-300">Shared Content</h2>
            <button
              onClick={toggleMediaModal}
              className="text-gray-400 hover:text-blue-300 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {data?.map((item, index) => (
                <MediaItem
                  key={index}
                  type={getFileCategory(item.fileType)}
                  url={item.fileUrl}
                  name={item.fileName}
                  onPreview={() => setPreviewItem(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {previewItem && (
        <PreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          fileCategory={getFileCategory(previewItem.fileType)}
        />
      )}
    </>
  );
}
