import { useEffect, useMemo, useState } from "react";
import { UserPlus, UserMinus, Search } from "lucide-react";
import GroupModalHead from "@/components/features/chat/group-chat/GroupModalHead";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { ChatRoomMember, MinifiedMessage } from "@/types/chatTypes";
import { KeyedMutator, mutate as gMutate } from "swr";
import AddMemberModal from "@/components/features/chat/group-chat/AddMemberModal";
import RoomMembers from "@/components/features/chat/group-chat/RoomMember";
import ConfirmationModal from "@/components/shared/ui/organisms/modal/confirmationModal";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { buildSystemMessage } from "@/utils/utils";
import { ecnf } from "@/utils/constants/env";
import { useParams, useRouter } from "next/navigation";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { useChatContext } from "@/components/shared/contexts/chat/chatContext";

interface GroupModalProps {
  onClose: () => void;
  roomName: string;
  members: ChatRoomMember[];
  mutate: KeyedMutator<ChatRoomMember[]>;
  roomImage: string | null;
}
const GroupModal = ({
  onClose,
  roomName,
  members,
  mutate,
  roomImage,
}: GroupModalProps) => {
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [translateClass, setTranslateClass] = useState("translateX(100%)");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const chatRoomId = useParams().chatId;
  const { showNotification } = useCommunication();
  const { updateLastActivity, setActiveChats } = useChatContext();

  const filteredMembers: ChatRoomMember[] = members.filter(
    (member: ChatRoomMember) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { user, checkAndRefreshToken } = useAuth();
  const router = useRouter()

  const [selectedMember, setSelectedMember] = useState<ChatRoomMember | null>(
    null
  );
  const [showMemberMenu, setShowMemberMenu] = useState(false);

  const isCurrentUserAdmin = useMemo(
    () => members.some((mem) => mem.userId === user?.userId && mem.isAdmin),
    [members, user]
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
        />
      )}
      <div className="fixed w-screen h-[100dvh] z-50 bg-black bg-opacity-60 left-0 top-0">
        <div
          onClick={() => {
            setShowMemberMenu(false);
            setSelectedMember(null);
          }}
          className="fixed inset-y-0 right-0 w-[40rem] bg-gray-900 shadow-lg transform transition-transform duration-300 z-50
          max-lg2:w-full
          "
          style={{ transform: translateClass }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <GroupModalHead
              roomName={roomName || ""}
              activeTab={activeTab}
              onClose={onClose}
              setActiveTab={setActiveTab}
              totalMembers={members.length}
              roomImage={roomImage}
            />
            {/* Content */}
            <div className="flex-grow overflow-y-auto py-4">
              {activeTab === "members" && (
                <div className="flex flex-col gap-3">
                  <div className=" flex flex-wrap gap-4 max-lg2:gap-2 px-3 text-[18px] max-sm:text-[16px] ">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search members"
                        className="w-full bg-gray-800 text-white  rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-700"
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
                      className="flex-grow bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <UserPlus size={18} />
                      <span>Add Member</span>
                    </button>
                  </div>

                  <div className="flex flex-col">
                    {filteredMembers.map((member) => {
                      return (
                        <RoomMembers
                          key={member.userId}
                          member={member}
                          mutate={mutate}
                          selectedMember={selectedMember}
                          setSelectedMember={setSelectedMember}
                          isCurrentUserAdmin={isCurrentUserAdmin}
                          setShowMenu={setShowMemberMenu}
                          showMenu={showMemberMenu}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              {activeTab === "media" && (
                <div className="grid grid-cols-3 gap-2"></div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-between">
              <button
                onClick={async (e) => {
                  setShowConfirmModal(true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
              >
                <UserMinus size={18} />
                <span>Leave Group</span>
              </button>
            </div>

            <ConfirmationModal
              confirmBtnText="Leave"
              isOpen={showConfirmModal}
              title="Leave group?"
              onClose={() => {
                setShowConfirmModal(false);
              }}
              onConfirm={async () => {
                const token = await checkAndRefreshToken();
                const res = await fetch(
                  `${ecnf.apiUrl}/chats/${chatRoomId}/members/me?username=${user?.username}`,
                  {
                    method: "DELETE",
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (res.ok) {
                  const data: ApiResponse<MinifiedMessage> = await res.json();
                  if (!data.data) return;

                  const newMessage = buildSystemMessage(data.data);

                  gMutate(
                    `${ecnf.apiUrl}/chats/${chatRoomId}/messages`,
                    (current?: AllMessageResponse) => {
                      if (!current || !data.data) return current;
                      return {
                        allReceipts: current.allReceipts,
                        attachments: current.attachments,
                        messages: [newMessage, ...current.messages],
                      };
                    },
                    false
                  );
                  mutate((current) => {
                    if (!current) return current;
                    return current.filter((mem) => {
                      return mem.userId !== user?.userId;
                    });
                  }, false);
                  updateLastActivity(chatRoomId as string, newMessage);
                  setActiveChats((prev) => {
                    if (!prev) return prev;
                    return prev.map((chat) => {
                      if (chat.chatRoomId !== chatRoomId) return chat;
                      return {
                        ...chat,
                        removedAt: new Date(
                          new Date(newMessage.createdAt).getTime() + 50
                        ).toISOString(),
                        unreadCount: 0,
                      };
                    });
                  });
                  router.push("/chats")
                } else {
                  showNotification("Some error occured!", "error");
                }
              }}
            >
              Are you sure you want to leave this group? You wont be able to
              send or receive any more messages
            </ConfirmationModal>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupModal;
