import { AttachmentViewModel } from "@/types/chatTypes";
import { Play} from "lucide-react";
import React, { useState } from "react";

const VideoPlayer = ({ attachments }: { attachments: AttachmentViewModel }) => {
  const [isFinished, setIsFinished] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false)

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
          onLoadedMetadata={() => setIsLoaded(true)}
          style={{ width: "auto", height: "auto" }}
        >
          <source src={attachments.fileUrl} />
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