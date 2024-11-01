import { Crown, MessageCircle, Pencil, Shield, UserMinus } from "lucide-react";
import { ChatRoomMember } from "./groupInfoModal";
import { MemberAction } from "@/types/chatTypes";

const MemberActions = ({
  member,
  handleMemberAction,
  isCurrentUserAdmin,
  currentUserId
}: {
  member: ChatRoomMember;
  handleMemberAction: (type: MemberAction) => void;
  isCurrentUserAdmin: boolean;
  currentUserId: string | undefined
}) => {
  return (
    <div className="absolute right-10 py-2 top-4 w-56 px-4 rounded-lg overflow-hidden shadow-lg bg-gray-800 ring-1 ring-gray-700 z-10">
      <button
        className="flex rounded-md items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
        onClick={() => handleMemberAction("nickname")}
      >
        <Pencil size={16} className="mr-3" />
        <span>Edit Nickname</span>
      </button>

      {member.userId !== currentUserId && (
        <>
          <button
            className="flex rounded-md items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
            onClick={() => handleMemberAction("message")}
          >
            <MessageCircle size={16} className="mr-3" />
            <span>Message</span>
          </button>
          {isCurrentUserAdmin && (
            <>
              {" "}
              <button
                className="flex rounded-md items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                onClick={() => handleMemberAction("admin")}
              >
                {member.isAdmin ? (
                  <>
                    <Shield size={16} className="mr-3 text-red-400" />
                    <span>Demote from Admin</span>
                  </>
                ) : (
                  <>
                    <Crown size={16} className="mr-3 text-yellow-400" />
                    <span>Promote to Admin</span>
                  </>
                )}
              </button>
              <div className="border-t border-gray-700 my-1"></div>
              <button
                className="flex rounded-md items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-150"
                onClick={() => handleMemberAction("remove")}
              >
                <UserMinus size={16} className="mr-3" />
                <span>Remove from Group</span>
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MemberActions;
