import { useEffect, useMemo, useState } from "react";
import { UserPlus, UserMinus, Search } from "lucide-react";
import GroupModalHead from "@/components/features/chat/group-chat/GroupModalHead";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { ChatRoomMember } from "@/types/chatTypes";
import { KeyedMutator } from "swr";
import AddMemberModal from "@/components/features/chat/group-chat/AddMemberModal";
import RoomMembers from "@/components/features/chat/group-chat/RoomMember";

const GroupModal = ({
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
        />
      )}
      <div className="fixed w-screen h-[100dvh] z-50 bg-black bg-opacity-60 left-0 top-0">
        <div
          className="fixed inset-y-0 right-0 w-[40rem] border-l-2 border-gray-700 bg-gray-900 shadow-lg transform transition-transform duration-300 z-50"
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

export default GroupModal