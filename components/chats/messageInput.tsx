import { Smile, Paperclip, Send } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function MessageInput({
  sendMessage,
  inputValue,
  setInputValue,
}: {
  sendMessage: Function;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="bg-[#1f2329] px-4 py-2 border-t border-gray-700 flex items-center space-x-4">
      <button className="text-gray-400 hover:text-white transition">
        <Smile size={24} />
      </button>
      <button className="text-gray-400 hover:text-white transition">
        <Paperclip size={24} />
      </button>
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 bg-[#292f36] text-white px-4 py-2 rounded-lg focus:outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
      />
      <button
        className="text-gray-400 hover:text-white transition"
        onClick={() => sendMessage()}
      >
        <Send size={24} />
      </button>
    </div>
  );
}