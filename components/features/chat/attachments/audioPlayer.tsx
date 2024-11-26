import React, {
  useState,
  useRef,
  ReactEventHandler,
  MutableRefObject,
} from "react";
import { Play, Pause } from "lucide-react";

export default function AudioPlayer({
  src,
  handleMediaError,
  audioRef,
}: {
  src?: string;
  handleMediaError: (isVideo: boolean) => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 bg-gray-700 bg-opacity-40 rounded-lg py-4 px-5 min-w-[20rem]">
      <audio
        ref={audioRef}
        src={src}
        onError={() => handleMediaError(false)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      <button
        onClick={handlePlayPause}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full"
      >
        {isPlaying ? (
          <Pause size={16} />
        ) : (
          <Play size={16} className="ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="h-1.5 bg-gray-700 hover:bg-opacity-80 rounded-full relative">
          <div
            ref={progressRef}
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            // value="0"
            className=" w-full absolute top-1/2 -translate-y-1/2 h-3 opacity-0 cursor-pointer "
            onChange={(e) => {
              if (!audioRef.current || !progressRef.current) return;
              audioRef.current.currentTime =
                audioRef.current.duration * (Number(e.target.value) / 100);
            }}
          />
          <div
            className="progressHead rounded-full w-3 h-3 bg-gray-300 absolute top-1/2 -translate-y-1/2 -translate-x-1 pointer-events-none"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-400">
          {isPlaying || currentTime > 0
            ? formatTime(currentTime)
            : formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
