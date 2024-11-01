import { AttachmentViewModel } from "@/types/chatTypes";
import { Play } from "lucide-react";
import React, { ReactEventHandler, RefObject, useState } from "react";

const VideoPlayer = ({
  attachments,
  handleMediaError,
  ref
}: {
  attachments: AttachmentViewModel;
  handleMediaError: (isVideo: boolean) => void;
  ref: RefObject<HTMLVideoElement>
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePlay = () => {
    setIsFinished(false);
  };

  const handleEnded = () => {
    setIsFinished(true);
  };

  return (
    <>
      <div className="relative cursor-pointer">
        <video
          controls={!isFinished && isLoaded}
          preload="metadata"
          onPlay={handlePlay}
          onEnded={handleEnded}
          onError={() => handleMediaError(true)}
          ref={ref}
          onLoadedMetadata={() => setIsLoaded(true)}
          style={{ width: "auto", height: "auto" }}
        >
          {attachments.fileUrl && <source src={attachments.fileUrl} />}
        </video>
        {isFinished && (
          <button
            onClick={() => {
              setIsFinished(false);
              const videoElement = document.querySelector(
                "video"
              ) as HTMLVideoElement;
              videoElement.currentTime = 0;
              videoElement.play();
            }}
            className="absolute inset-0 group flex items-center justify-center bg-black bg-opacity-50 text-white"
            style={{ zIndex: 10 }}
          >
            <Play className=" opacity-70 w-8 h-8 group-hover:opacity-50" />
          </button>
        )}
      </div>
    </>
  );
};

export default VideoPlayer;
