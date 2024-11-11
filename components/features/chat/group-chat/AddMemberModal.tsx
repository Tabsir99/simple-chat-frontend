import useAddMember from "@/components/shared/hooks/chat/group-chat/useAddMember";
import { Search, UserPlus, X, Check, AlertCircle } from "lucide-react";

interface AddMemberModalProps {
  onClose: () => void;
}

const AddMemberModal = ({ onClose }: AddMemberModalProps) => {
  const {
    handleAddMember,
    handleInputChange,
    handleSubmit,
    isLoading,
    searchResults,
    showMessage,
    searchTerm,
    selectedUsers,
    toggleUserSelection,
  } = useAddMember(onClose);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 rounded-lg w-full max-w-xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add Members</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Box */}
        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="relative"
          >
            <input
              type="search"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </form>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{user.username}</span>
                  <button
                    onClick={() => toggleUserSelection(user)}
                    className="hover:text-gray-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Results */}
          <div className="mt-6 space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="text-center text-gray-400 py-4">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.userId}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.some((u) => u.userId === user.userId)
                      ? "bg-blue-500 bg-opacity-20"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white">{user.username}</span>
                  </div>
                  {selectedUsers.some((u) => u.userId === user.userId) && (
                    <Check size={20} className="text-blue-500" />
                  )}
                </div>
              ))
            ) : showMessage.notFound ? (
              <div className="text-center text-gray-400 py-4">
                No users found
              </div>
            ) : showMessage.warning ? (
              <div className="text-center text-yellow-500 py-4">
                Please enter between 2 and 30 characters
              </div>
            ) : null}
          </div>

          {/* Warning Alert */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 bg-yellow-500 bg-opacity-10 border-yellow-500 flex gap-1 items-center justify-center py-2 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-500 block">
                New users will be able to see all previous messages in this
                chat.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMember}
            disabled={selectedUsers.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <UserPlus size={18} />
            Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
