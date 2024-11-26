import React, {
  useState,
  useMemo,
  ReactPropTypes,
  Attributes,
  HTMLAttributes,
  useEffect,
} from "react";
import { X } from "lucide-react";
import { emojiCollection } from "@/utils/constants/emojiArray";

type EmojiCategory =
  | "Smileys"
  | "Gestures"
  | "Hearts"
  | "Animals"
  | "Nature"
  | "Food";
type SelectedCategory = EmojiCategory | "all";

export type EmojiCollectionType = {
  [key in EmojiCategory]: string[];
};

interface EmojiPickerProps extends HTMLAttributes<HTMLDivElement> {
  onEmojiSelect: (emoji: string) => void;
  defaultCategory?: SelectedCategory;
  onClose: () => void;
}

type FilteredEmojisType = [string, string[]][];


const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  defaultCategory = "all",
  onClose,
  ...rest
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>(defaultCategory);

  const filteredEmojis: FilteredEmojisType = useMemo(() => {
    let emojis: [string, string[]][] =
      selectedCategory === "all"
        ? Object.entries(emojiCollection)
        : [[selectedCategory, emojiCollection[selectedCategory]]];

    return emojis;
  }, [selectedCategory]);

  const handleEmojiClick = (emoji: string): void => {
    onEmojiSelect(emoji);
  };

  const handleCategoryClick = (category: SelectedCategory): void => {
    setSelectedCategory(category);
  };

  return (
    <div {...rest}>
      {
        <div className=" mt-2 w-full bg-gray-900 rounded-md shadow-2xl">
          {/* Header */}
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-medium">Emoji Picker</h3>
            <button
              onClick={() => onClose()}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close emoji picker"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 p-2 overflow-x-auto border-b border-gray-700">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              type="button"
            >
              All
            </button>
            {(Object.keys(emojiCollection) as EmojiCategory[]).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                  type="button"
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* Emoji Grid */}
          <EmojiCollection
            filteredEmojis={filteredEmojis}
            handleEmojiClick={handleEmojiClick}
          />
        </div>
      }
    </div>
  );
};

export default EmojiPicker;

const EmojiCollection = ({
  filteredEmojis,
  handleEmojiClick,
}: {
  filteredEmojis: FilteredEmojisType;
  handleEmojiClick: (emoji: string) => void;
}) => {
  return (
    <div className="pb-3">
      <div className="h-48 overflow-y-auto flex flex-col gap-6 p-2">
        {filteredEmojis.map(([category, emojis]) => (
          <div key={category}>
            <h4 className="text-gray-400 text-sm font-medium mb-2 px-4">
              {category}
            </h4>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] justify-items-center items-center gap-0">
              {emojis.map((emoji, index) => (
                <button
                  key={`${category}-${index}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className=" w-10 h-10 text-xl hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                  aria-label={`Select ${emoji} emoji`}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
