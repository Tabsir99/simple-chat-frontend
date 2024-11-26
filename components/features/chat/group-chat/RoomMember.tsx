import MemberMenu from "./MemberMenu";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import useMemberAction from "@/components/shared/hooks/chat/group-chat/useMemberAction";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
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
  setShowMenu,
  showMenu,
}: {
  member: ChatRoomMember;
  mutate: KeyedMutator<ChatRoomMember[]>;
  selectedMember: ChatRoomMember | null;
  setSelectedMember: Dispatch<SetStateAction<ChatRoomMember | null>>;
  isCurrentUserAdmin: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  showMenu: boolean;
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
    <div className="flex items-center justify-between bg-transparent hover:bg-gray-800 hover:bg-opacity-40 transition p-3 max-sm:py-2 rounded-lg relative">
      <div className="flex items-center gap-2">
        <Avatar
          avatarName={member.username}
          profilePicture={member.profilePicture || null}
          className="w-8 h-8 text-[14px]"
        />
        <div className="flex flex-col">
          <span className="text-gray-200 capitalize max-sm:text-[16px] ">
            {member.username}{" "}
            {member.userId === user?.userId && <span> (You) </span>}
          </span>
          {!isEditing ? (
            <p className="text-xs text-gray-400">{member.nickName}</p>
          ) : (
            <div className="flex gap-1 mt-1">
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                placeholder="Enter nickname..."
                className=" w-full text-[16px] max-w-40 px-2 bg-gray-700 rounded-md mr-2 outline-none border-2 border-transparent focus:border-blue-500  "
              />

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNicknameChange(e);
                  setShowMenu(false);
                }}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 rounded-full p-1.5 disabled:cursor-not-allowed"
              >
                <Check />
              </button>
              <button
                className="p-1.5 rounded-full hover:bg-gray-700"
                onClick={() => {
                  setIsEditing(false);
                  setNickName(member.nickName || "");
                  setSelectedMember(null);
                  setShowMenu(false);
                }}
              >
                <X />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[16px] max-sm:text-[14px] text-gray-300">
        <div className="flex items-center gap-3 max-sm:flex-col max-sm:gap-1">
          {member.isAdmin ? (
            <span className=" flex items-center gap-1 border border-gray-700 bg-gray-700 bg-opacity-40 px-2 py-[3px] rounded-full ">
              Admin <Star size={18} className="max-sm:hidden" />
            </span>
          ) : (
            <span className=" flex items-center gap-1 border border-gray-700 bg-gray-700 bg-opacity-40 px-2 py-[3px] rounded-full ">
              Member <User size={18} className="max-sm:hidden" />
            </span>
          )}
        </div>
        <button
          className="text-gray-400 hover:text-white py-4 px-2"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMember(
              selectedMember?.userId === member.userId ? null : member
            );
            setShowMenu(true);
          }}
        >
          <MoreHorizontal size={18} />
        </button>
        {showMenu && selectedMember?.userId === member.userId && (
          <MemberMenu
            handleMemberAction={handleMemberAction}
            member={member}
            isCurrentUserAdmin={isCurrentUserAdmin}
            currentUserId={user?.userId}
            setShowMenu={setShowMenu}
          />
        )}
      </div>
    </div>
  );
};

export default RoomMembers;
