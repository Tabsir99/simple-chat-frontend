import { Smile, Paperclip } from "lucide-react";

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
      <div className="flex items-center gap-4 relative z-40 pt-1">
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
