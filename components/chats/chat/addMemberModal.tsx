import React, { useState, useRef, useEffect } from "react";
import { Search, UserPlus, X, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/authComps/authcontext";
import { useNotification } from "@/components/contextProvider/notificationContext";
import { ecnf } from "@/utils/env";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useParams } from "next/navigation";
import { mutate } from "swr";
import { ChatRoomMember, IMessage, MinifiedMessage } from "@/types/chatTypes";
import { useChatContext } from "@/components/contextProvider/chatContext";

interface AddMemberModalProps {
  onClose: () => void;
  onAddMembers: (members: User[]) => void;
}

type User = {
  userId: string;
  username: string;
  profilePicture: null;
};

const AddMemberModal = ({ onClose, onAddMembers }: AddMemberModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRoomId = useParams().chatId;
  const [showMessage, setShowMessage] = useState({
    notFound: false,
    warning: false,
    default: true,
  });
  const { updateLastActivity } = useChatContext();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const queryRef = useRef("");

  const { checkAndRefreshToken } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    // Reset results when search term changes
    setSearchResults([]);
    if (!showMessage.notFound) {
      queryRef.current = searchTerm;
    }

    const searchUsers = async () => {
      setShowMessage({
        default: false,
        notFound: false,
        warning: false,
      });
      setIsLoading(true);

      // Cancel any ongoing requests
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      try {
        const token = await checkAndRefreshToken();
        const response = await fetch(
          `${ecnf.apiUrl}/users?query=${encodeURIComponent(
            searchTerm
          )}&chatRoomId=${chatRoomId}`,
          {
            signal: abortController.current.signal,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data: ApiResponse<User[]> = await response.json();
          setSearchResults(data.data as User[]);
          if (data.data?.length === 0) {
            queryRef.current = searchTerm;
            setShowMessage({
              default: false,
              notFound: true,
              warning: false,
            });
          }
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          showNotification("Failed to search users", "error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    let warningTimer: NodeJS.Timeout;

    if (searchTerm.length > 1 && searchTerm.length < 30) {
      // Set new timeout for search
      debounceTimeout.current = setTimeout(() => {
        searchUsers();
      }, 500);
    } else if (searchTerm.trim() === "") {
      setShowMessage({
        warning: false,
        default: true,
        notFound: false,
      });
    } else {
      if (!showMessage.notFound) {
        warningTimer = setTimeout(() => {
          setShowMessage({
            default: false,
            notFound: false,
            warning: true,
          });
        }, 600);
      } else {
        setShowMessage({
          default: false,
          notFound: false,
          warning: true,
        });
      }
    }

    // Cleanup function
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
    };
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.userId === user.userId);
      if (isSelected) {
        return prev.filter((u) => u.userId !== user.userId);
      }
      return [...prev, user];
    });
  };

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
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

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
            onClick={async () => {
              const token = await checkAndRefreshToken();
              const res = await fetch(`${ecnf.apiUrl}/chats/members`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  chatRoomId: chatRoomId,
                  users: selectedUsers.map((user) => ({
                    userId: user.userId,
                    username: user.username,
                  })),
                }),
              });
              if (res.ok) {
                const data: ApiResponse<MinifiedMessage> = await res.json();
                if (!data.data) return;
                const newMessage: IMessage = {
                  content: data.data.content,
                  createdAt: data.data.createdAt,
                  messageId: data.data.messageId,
                  MessageReaction: [],
                  type: "system",
                  status: "delivered",
                  parentMessage: null,
                  sender: null,
                };
                mutate(
                  `${ecnf.apiUrl}/chats/${chatRoomId}/members`,
                  (current?: ChatRoomMember[]) => {
                    if (!current) return current;
                    const newMembers: ChatRoomMember[] = selectedUsers.map(
                      (m) => {
                        return {
                          isAdmin: false,
                          isCreator: false,
                          userId: m.userId,
                          username: m.username,
                          profilePicture: m.profilePicture || undefined,
                          userStatus: "offline",
                          nickName: "",
                        };
                      }
                    );

                    return [...current, ...newMembers];
                  },
                  false
                );
                mutate(
                  `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
                  (current?: AllMessageResponse) => {
                    if (!current) return current;
                    return {
                      allReceipts: current.allReceipts,
                      attachments: current.attachments,
                      messages: [newMessage, ...current.messages],
                    };
                  }
                );
                
                updateLastActivity(chatRoomId as string, newMessage);
                showNotification("Membe added", "success");
              } else {
                showNotification("Error occured", "error");
              }
              onClose();
            }}
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
