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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 md:p-0">
      <div className="bg-gray-900 w-full h-[90dvh] md:rounded-xl md:max-w-2xl transform transition-all overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <h2 className="text-lg md:text-xl font-semibold text-white">Add Members</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden ">
          <div className="px-4 py-2 md:px-6 flex flex-col gap-4 h-full overflow-y-auto">
            {/* Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  placeholder="Search users by name or email"
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg py-2.5 pl-10 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                />
              </div>
            </form>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                  >
                    <span>{user.username}</span>
                    <button
                      onClick={() => toggleUserSelection(user)}
                      className="hover:text-blue-300 p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            <div className="flex items-start gap-4 ">
              {isLoading ? (
                <div className="text-center text-gray-400 py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.userId}
                    className={`flex items-center flex-grow justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      selectedUsers.some((u) => u.userId === user.userId)
                        ? "bg-blue-500/20 ring-2 ring-blue-500"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-sm md:text-base">{user.username}</span>
                    </div>
                    {selectedUsers.some((u) => u.userId === user.userId) && (
                      <Check size={18} className="text-blue-400" />
                    )}
                  </div>
                ))
              ) : (
                <div className="texspace-y-6t-center py-8">
                  {showMessage.notFound && (
                    <div className="text-gray-400">No users found</div>
                  )}
                  {showMessage.warning && (
                    <div className="text-yellow-500">
                      Please enter between 2 and 30 characters
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Warning Alert */}
            {selectedUsers.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-yellow-500 text-sm">
                  New users will be able to see all previous messages in this chat.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMember}
            disabled={selectedUsers.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <UserPlus size={16} />
            Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
