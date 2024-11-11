import MemberMenu from "./MemberMenu";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import useMemberAction from "@/components/shared/hooks/chat/group-chat/useMemberAction";
import { ChatRoomMember } from "@/types/chatTypes";
import { Check, Crown, MoreHorizontal, Star, User, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { KeyedMutator } from "swr";

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

  const { handleMemberAction, handleNicknameChange } = useMemberAction({
    mutate,
    nickName,
    selectedMember,
    setIsEditing,
    setSelectedMember,
  });
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
                onClick={handleNicknameChange}
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
          <MemberMenu
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

export default RoomMembers;
