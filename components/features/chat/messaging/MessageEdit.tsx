import { Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const MessageEditModal = ({
  onClose,
  handleEdit,
  initialMessage,
}: {
  onClose: () => void;
  handleEdit: (editedContent: string) => void;
  initialMessage: string;
}) => {
  const [editedContent, setEditedContent] = useState(initialMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.focus();
    }
  }, [initialMessage]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!initialMessage) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50 animate-in fade-in duration-200"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg shadow-xl transform transition-all duration-200 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">
              Edit Message
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={20} className="dark:text-gray-400" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full min-h-[120px] text-[18px] p-3 rounded-lg bg-gray-50 dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700 resize-none focus:outline-none 
              focus:ring-2 focus:ring-blue-500 dark:text-white"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-colors dark:text-white flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={() => {
                handleEdit(editedContent);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition-colors flex items-center gap-2"
            >
              <Check size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageEditModal;
