import React, { useState } from "react";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import { Image, Link, Users, X, Edit2, Camera } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "next/navigation";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { ecnf } from "@/utils/constants/env";
import { mutate } from "swr";
import { MinifiedMessage } from "@/types/chatTypes";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { buildSystemMessage } from "@/utils/utils";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { useChatContext } from "@/components/shared/contexts/chat/chatContext";

const GroupModalHead = ({
  roomName,
  onClose,
  activeTab,
  setActiveTab,
  totalMembers = 2,
  roomImage,
}: {
  roomName: string;
  onClose: () => void;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  totalMembers: number;
  roomImage: string | null;
}) => {
  const { chatId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const { socket } = useCommunication();
  const [newName, setNewName] = useState(roomName);
  const { checkAndRefreshToken } = useAuth();
  const { updateLastActivity } = useChatContext()

  const tabs: { id: string; label: string }[] = [
    { id: "members", label: "Members" },
    { id: "attachments", label: "Attachments" },
  ];

  const { showNotification } = useCommunication();

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsEditing(false);

    if (!newName.trim() || newName.trim() === roomName) {
      setNewName(roomName);
      return;
    }

    try {
      const token = await checkAndRefreshToken();
      const response = await fetch(`${ecnf.apiUrl}/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomName: newName.trim(), type: "name" }),
      });

      if (!response.ok) throw new Error("Failed to update room name");
      mutate(`${ecnf.apiUrl}/chats`);
      const data = (await response.json()) as ApiResponse<MinifiedMessage>;
      mutate(
        `${ecnf.apiUrl}/chats/${chatId}/messages`,
        (current?: AllMessageResponse) => {
          if (!current) return current;
          const newMsg = buildSystemMessage(data.data as MinifiedMessage);

          return {
            allReceipts: current.allReceipts,
            attachments: current.attachments,
            messages: [newMsg, ...current.messages],
          };
        },
        false
      );

      showNotification("Room name updated successfully", "success");
    } catch (error) {
      showNotification("Failed to update room name", "error");
      setNewName(roomName);
    }
  };

  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size should be less than 5MB", "error");
      return;
    }

    try {
      const token = await checkAndRefreshToken();
      const response = await fetch(`${ecnf.apiUrl}/chats/${chatId}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: file.name,
          type: file.type,
          size: file.size,
        }),
      });

      if (!response.ok) throw new Error("Failed to update room image");
      const data = (await response.json()) as ApiResponse<{signedUrl: string, newMessage: MinifiedMessage}>;
      await fetch(data.data?.signedUrl as string, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      
      const newMsg = buildSystemMessage(data.data?.newMessage as MinifiedMessage);

      mutate(
        `${ecnf.apiUrl}/chats/${chatId}/messages`,
        (current?: AllMessageResponse) => {
          if (!current) return current;

          return {
            allReceipts: current.allReceipts,
            attachments: current.attachments,
            messages: [newMsg, ...current.messages],
          };
        },
        false
      );

      updateLastActivity(chatId as string,newMsg)
      socket?.emit("chatRoom:update", {
        chatRoomId: chatId,
      });
      showNotification("Room image updated successfully", "success");
    } catch (error) {
      showNotification("Failed to update room image", "error");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Avatar avatarName={roomName} profilePicture={roomImage} />
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera size={20} className="text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpdate}
              />
            </label>
          </div>

          <div className="flex flex-col gap-0 leading-none">
            {isEditing ? (
              <form
                onSubmit={handleNameUpdate}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-700/50 text-white rounded px-2 py-1 text-xl max-sm:text-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />

                <button
                  type="submit"
                  className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition "
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!newName.trim()) {
                      setNewName(roomName);
                    }
                    setIsEditing(false);
                  }}
                  className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition "
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl capitalize text-white max-sm:text-[18px]">
                  {roomName}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-400 max-sm:text-[14px]">
              {totalMembers} members
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center border-b-2 justify-center space-x-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? "text-blue-500 border-blue-500"
                : "text-gray-400 hover:text-white border-transparent"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id === "members" ? <Users /> : <Image />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default GroupModalHead;
