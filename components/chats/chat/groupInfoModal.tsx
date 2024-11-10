import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  X,
  Users,
  UserPlus,
  UserMinus,
  Image,
  Link,
  Search,
  MoreHorizontal,
  MessageCircle,
  Crown,
  Shield,
  User,
  Star,
  Check,
} from "lucide-react";
import GroupInfoModalHeader from "./groupInfoModalHeader";
import MemberActions from "./memberActions";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import {
  ChatRoomMember,
  MemberAction,
  MinifiedMessage,
} from "@/types/chatTypes";
import { KeyedMutator, mutate as gMutate } from "swr";
import { ecnf } from "@/utils/env";
import { useParams } from "next/navigation";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import AddMemberModal from "./addMemberModal";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { useChatContext } from "@/components/shared/contexts/chat/chatContext";


export const GroupInfoModal = ({
  onClose,
  roomName,
  members,
  mutate,
  chatRoomId,
}: {
  onClose: () => void;
  roomName: string;
  members: ChatRoomMember[];
  mutate: KeyedMutator<ChatRoomMember[]>;
  chatRoomId: string;
}) => {
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [translateClass, setTranslateClass] = useState("translateX(100%)");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const filteredMembers: ChatRoomMember[] = members.filter(
    (member: ChatRoomMember) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { user } = useAuth();

  const handleAddMember = () => {
    console.log("Add member clicked");
  };

  const [selectedMember, setSelectedMember] = useState<ChatRoomMember | null>(
    null
  );

  const isCurrentUserAdmin = useMemo(
    () => members.some((mem) => mem.userId === user?.userId && mem.isAdmin),
    [members]
  );

  useEffect(() => {
    setTranslateClass("translateX(0)");
  }, []);
  return (
    <>
      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => {
            setShowAddMemberModal(false);
          }}
          onAddMembers={() => {}}
        />
      )}
      <div className="fixed w-screen h-screen z-50 bg-black bg-opacity-60 left-0 top-0">
        <div
          className="fixed inset-y-0 right-0 w-[40rem] border-l-2 border-gray-700 bg-gray-900 shadow-lg transform transition-transform duration-300 z-50"
          style={{ transform: translateClass }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <GroupInfoModalHeader
              roomName={roomName || ""}
              activeTab={activeTab}
              onClose={onClose}
              setActiveTab={setActiveTab}
            />
            {/* Content */}
            <div className="flex-grow overflow-y-auto p-4">
              {activeTab === "members" && (
                <div className="space-y-4">
                  <div className=" flex gap-6">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Search members"
                        className="w-full bg-gray-800 text-white  rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search
                        size={26}
                        className=" absolute right-3 top-2.5 text-gray-400"
                      />
                    </div>

                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <UserPlus size={18} />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {filteredMembers.map((member) => {
                    return (
                      <RoomMembers
                        key={member.userId}
                        member={member}
                        mutate={mutate}
                        selectedMember={selectedMember}
                        setSelectedMember={setSelectedMember}
                        isCurrentUserAdmin={isCurrentUserAdmin}
                        chatRoomId={chatRoomId}
                      />
                    );
                  })}
                </div>
              )}
              {activeTab === "media" && (
                <div className="grid grid-cols-3 gap-2"></div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-between">
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2">
                <UserMinus size={18} />
                <span>Leave Group</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const RoomMembers = ({
  member,
  mutate,
  selectedMember,
  setSelectedMember,
  isCurrentUserAdmin,
  chatRoomId,
}: {
  member: ChatRoomMember;
  mutate: KeyedMutator<ChatRoomMember[]>;
  selectedMember: ChatRoomMember | null;
  setSelectedMember: Dispatch<SetStateAction<ChatRoomMember | null>>;
  isCurrentUserAdmin: boolean;
  chatRoomId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickName, setNickName] = useState<string>(member.nickName || "");

  const { checkAndRefreshToken } = useAuth();
  const { chatId } = useParams();
  const { showNotification } = useCommunication();
  const { updateLastActivity } = useChatContext()

  
  const handleMemberAction = async (action: MemberAction) => {
    switch (action) {
      case "message":
        break;

      case "admin":
        const token = await checkAndRefreshToken();
        const res = await fetch(`${ecnf.apiUrl}/chats/members`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatRoomId: chatId,
            userId: selectedMember?.userId,
            action: selectedMember?.isAdmin ? "demote" : "promote",
            username: selectedMember?.username,
          }),
        });

        if (res.ok) {
          mutate((current) => {
            if (!current) return current;
            return current.map((mem) => {
              if (mem.userId !== selectedMember?.userId) return mem;
              return {
                ...mem,
                isAdmin: !mem.isAdmin,
              };
            });
          }, false);
          const data: ApiResponse<MinifiedMessage> = await res.json();
          if(!data.data) return
          const newMessage1 = {
            content: data.data.content,
            createdAt: data.data.createdAt,
            messageId: data.data.messageId,
            type: "system" as const,
            sender: null,
            status: "delivered" as const,
            MessageReaction: [],
            parentMessage: null,
          }
          gMutate(
            `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
            (current?: AllMessageResponse) => {
              if (!current || !data.data) return current;

              return {
                allReceipts: current.allReceipts,
                attachments: current.attachments,
                messages: [
                  {
                    content: data.data.content,
                    createdAt: data.data.createdAt,
                    messageId: data.data.messageId,
                    type: "system" as const,
                    sender: null,
                    status: "delivered" as const,
                    MessageReaction: [],
                    parentMessage: null,
                  },
                  ...current.messages
                ],
              };
            },
            false
          );
          updateLastActivity(chatRoomId,newMessage1)
        } else {
          showNotification("Could not perform the action", "error");
        }
        setSelectedMember(null);
        break;

      case "nickname":
        setIsEditing(true);

        break;

      case "remove":
        const toke2 = await checkAndRefreshToken();
        const res2 = await fetch(
          `${ecnf.apiUrl}/chats/${chatRoomId}/members/${selectedMember?.userId}?username=${selectedMember?.username}`,
          {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${toke2}`,
            },
          }
        );
        if (res2.ok) {
          const data: ApiResponse<MinifiedMessage> = await res2.json();
          if(!data.data) return
          const newMessage = {
            content: data.data.content,
            createdAt: data.data.createdAt,
            messageId: data.data.messageId,
            type: "system" as const,
            sender: null,
            status: "delivered" as const,
            MessageReaction: [],
            parentMessage: null,
          }

          gMutate(
            `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
            (current?: AllMessageResponse) => {
              if (!current || !data.data) return current;
              return {
                allReceipts: current.allReceipts,
                attachments: current.attachments,
                messages: [
                  newMessage,
                  ...current.messages,
                ],
              };
            },
            false
          );
          mutate((current) => {
            if (!current) return current;
            return current.filter((mem) => {
              return mem.userId !== selectedMember?.userId
            });
          }, false);
          updateLastActivity(chatRoomId,newMessage)

          setSelectedMember(null)
        } else {
          showNotification("Could not remove member!", "error");
        }
        break;
    }
  };

  const { user } = useAuth();
  return (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg relative">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
            {member.username.charAt(0)}
          </div>
          {member.userStatus === "online" ? (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          ) : (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-gray-800"></div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-200 capitalize">
            {member.username}{" "}
            {member.userId === user?.userId && <span> (You) </span>}
          </span>
          {!isEditing ? (
            <p className="text-xs text-gray-400">{member.nickName}</p>
          ) : (
            <div className="flex gap-1 mt-1">
              <input
                type="text"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                placeholder="Enter nickname..."
                className=" w-full text-[16px] max-w-40 px-2 bg-gray-700 rounded-md mr-2 outline-none border-2 border-transparent focus:border-blue-500  "
              />

              <button
                onClick={async (e) => {
                  setIsEditing(false);
                  e.currentTarget.disabled = true;

                  const token = await checkAndRefreshToken();
                  const res = await fetch(`${ecnf.apiUrl}/chats/members`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      chatRoomId: chatId,
                      userId: selectedMember?.userId,
                      nickname: nickName,
                      action: "nickname",
                      username: selectedMember?.username,
                    }),
                  });

                  if (res.ok) {
                    const data: ApiResponse<MinifiedMessage> = await res.json()
                    if(!data.data) return

                    const newMessage = {
                      content: data.data.content,
                      createdAt: data.data.createdAt,
                      messageId: data.data.messageId,
                      type: "system" as const,
                      sender: null,
                      status: "delivered" as const,
                      MessageReaction: [],
                      parentMessage: null,
                    }
                    gMutate(
                      `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
                      (current?: AllMessageResponse) => {
                        if (!current) return current;
          
                        
                        return {
                          allReceipts: current.allReceipts,
                          attachments: current.attachments,
                          messages: [
                            newMessage,
                            ...current.messages
                          ],
                        };
                      },
                      false
                    );
                    mutate((current) => {
                      if (!current) return current;
                      return current.map((mem) => {
                        if (mem.userId !== selectedMember?.userId) return mem;
                        return {
                          ...mem,
                          nickName: nickName,
                        };
                      });
                    }, false);

                    updateLastActivity(chatRoomId,newMessage)

                  } else {
                    showNotification("Could not perform the action", "error");
                  }
                  setSelectedMember(null);
                }}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 rounded-full p-1.5 disabled:cursor-not-allowed"
              >
                <Check />
              </button>
              <button
                className="p-1.5 rounded-full hover:bg-gray-700"
                onClick={() => {
                  setIsEditing(false);
                  setNickName(member.nickName || "(Not set)");
                  setSelectedMember(null);
                }}
              >
                <X />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {member.isAdmin ? (
          <span className="text-gray-300 text-[16px] flex items-center gap-1 px-3 py-2 bg-gray-900 rounded-md ">
            Admin <Crown size={16} className="text-yellow-500" />
          </span>
        ) : (
          <span className="text-gray-300 text-[16px] flex items-center gap-1 px-3 py-2 bg-gray-900 rounded-md ">
            Member <User size={16} className="text-gray-500" />
          </span>
        )}
        {member.isCreator && (
          <span className="text-gray-300 text-[16px] flex items-center gap-1 px-3 py-2 bg-gray-900 rounded-md ">
            Creator <Star size={16} className="text-blue-400" />
          </span>
        )}
        <button
          className="text-gray-400 hover:text-white py-4 px-2"
          onClick={() => {
            setSelectedMember(
              selectedMember?.userId === member.userId ? null : member
            );
          }}
        >
          <MoreHorizontal size={18} />
        </button>
        {selectedMember?.userId === member.userId && (
          <MemberActions
            handleMemberAction={handleMemberAction}
            member={member}
            isCurrentUserAdmin={isCurrentUserAdmin}
            currentUserId={user?.userId}
          />
        )}
      </div>
    </div>
  );
};
