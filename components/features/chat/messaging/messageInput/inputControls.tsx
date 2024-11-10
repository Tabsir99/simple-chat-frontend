import { Smile, Paperclip, Send, Mic, Square } from "lucide-react";

interface InputControlsProps {
  showEmojis: boolean;
  setShowEmojis: (show: boolean) => void;
  handleFileClick: () => void;
}

export const InputControls = ({
  showEmojis,
  setShowEmojis,
  handleFileClick,
}: InputControlsProps) => {
  return (
    <>
      <div className="flex items-center gap-4 relative z-40 pt-2">
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="p-2 ml-2 absolute hover:bg-gray-700 rounded-full transition-colors"
        >
          <Smile className="w-4 h-4 text-gray-400 hover:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={handleFileClick}
          className="p-2 absolute ml-9 max-sm:ml-8 hover:bg-gray-700 rounded-full transition-colors"
        >
          <Paperclip className="w-4 h-4 text-gray-400 hover:text-gray-300" />
        </button>
      </div>
    </>
  );
};

interface InputSubmitControlsProps {
  shouldShowSend: boolean;
  isRecording: boolean;
  handleDynamicButtonClick: () => void;
}
export const InputSubmitControls = ({
  handleDynamicButtonClick,
  isRecording,
  shouldShowSend,
}: InputSubmitControlsProps) => {
  return (
    <button
      type={shouldShowSend ? "submit" : "button"}
      onClick={handleDynamicButtonClick}
      className={`p-2 self-center rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 ${
        shouldShowSend
          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          : isRecording
          ? "bg-red-500/20 text-red-500 animate-pulse"
          : "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
      }`}
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transition-all duration-200 transform ${
            shouldShowSend ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <Send className="w-5 h-5" />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-200 transform ${
            !shouldShowSend && !isRecording
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50"
          }`}
        >
          <Mic className="w-5 h-5" />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-200 transform ${
            isRecording ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <Square className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};
