import { Check, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

const MessageEdit = ({
  editedContent,
  setEditedContent,
  setIsEditing,
  handleEdit,
}: {
  editedContent: string;
  setEditedContent: Dispatch<SetStateAction<string>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  handleEdit: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedContent]);

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="bg-gray-700 text-white rounded px-3 py-2 min-h-[100px] resize-none overflow-hidden"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            setIsEditing(false);
          }}
          className="p-2 hover:bg-gray-600 rounded-full transition-colors duration-200"
        >
          <X size={20} />
        </button>
        <button
          onClick={handleEdit}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors duration-200"
        >
          <Check size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageEdit