import React, { useEffect, useState } from "react";
import { X, Camera } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");

  const [reRender, setRerender] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      onClose();
    }
  };

  useEffect(() => {
    setRerender(true);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative w-full max-w-sm bg-gray-800 rounded-lg transition-all duration-300 ${
          reRender ? "" : "scale-50 translate-y-20 opacity-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Create Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium 
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
