import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

// Types
type EmojiCategory = 'Smileys' | 'Gestures' | 'Hearts' | 'Animals' | 'Nature' | 'Food';
type SelectedCategory = EmojiCategory | 'all';

type EmojiCollectionType = {
    [key in EmojiCategory]: string[]
  }

interface EmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void;
  className?: string;
  defaultCategory?: SelectedCategory;
  onClose: () => void
}

// Emoji collection with type safety
const emojiCollection: EmojiCollectionType = {
  "Smileys": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😆", "😊", "😇", "🙂", "🙃", "😉","😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁","😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "💀", "☠️", "👻", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"],
  "Gestures": ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "❤️‍🔥", "❤️‍🩹", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  "Animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅", "🦉"],
  "Nature": ["🌸", "💮", "🌹", "🌺", "🌻", "🌼", "🌷", "🌱", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃"],
  "Food": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🍍", "🥝", "🍅", "🥑", "🍆", "🥔", "🥕", "🌭", "🍔", "🍟", "🍕"]
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  onEmojiSelect, 
  className = '',
  defaultCategory = 'all',
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>(defaultCategory);

  type FilteredEmojisType = [string, string[]][];

  const filteredEmojis: FilteredEmojisType = useMemo(() => {
    let emojis: [string, string[]][] = selectedCategory === 'all' 
      ? Object.entries(emojiCollection)
      : [[selectedCategory, emojiCollection[selectedCategory]]];

    
    return emojis;
  }, [selectedCategory]);

  const handleEmojiClick = (emoji: string): void => {
    onEmojiSelect?.(emoji);
    onClose();
  };

  const handleCategoryClick = (category: SelectedCategory): void => {
    setSelectedCategory(category);
  };

  return (
    <div className={` ${className}`}>

      {(
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
              onClick={() => handleCategoryClick('all')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              type="button"
            >
              All
            </button>
            {(Object.keys(emojiCollection) as EmojiCategory[]).map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="h-48 overflow-y-auto p-2 space-y-4">
            {filteredEmojis.map(([category, emojis]) => (
              <div key={category}>
                <h4 className="text-gray-400 text-sm font-medium mb-2 px-2">{category}</h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={`${category}-${index}`}
                      onClick={() => handleEmojiClick(emoji)}
                      className="p-2 text-xl hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
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

          {/* Footer */}
          <div className="p-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              Click an emoji to copy
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;