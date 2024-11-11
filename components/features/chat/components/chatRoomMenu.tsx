import { MenuAction, MenuItem } from "@/types/chatTypes";
import { Ban, ImageIcon, Info, LogOut, Trash, User, Users } from "lucide-react";
import { RefObject } from "react";

const createMenuConfig = (
  userId: string | null,
  removedAt: string | null,
  blockedUserId: string | null
): Record<"regular" | "group", MenuItem[]> => {
  const isCurrentUserBlocked =
    blockedUserId && blockedUserId !== userId ? true : false;

  return {
    regular: [
      {
        item: "Profile",
        icon: <User size={18} />,
        action: { type: "NAVIGATE", path: `/search-people/${userId}` },
      },
      {
        item: "Media",
        icon: <ImageIcon size={18} />,
        action: { type: "TOGGLE_MEDIA" },
      },
      ...(isCurrentUserBlocked
        ? []
        : [
            {
              item: blockedUserId ? "Unblock" : "Block",
              icon: <Ban />,
              action: { type: blockedUserId ? "UNBLOCK" : "BLOCK" } as const,
            },
          ]),
      {
        item: "Create Group",
        icon: <Users size={18} />,
        action: { type: "CREATE_GROUP" },
      },
      {
        item: "Delete Chat",
        icon: <Trash size={18} />,
        action: { type: "DELETE_CHAT" },
      },
    ],
    group: [
      ...(!removedAt
        ? [
            {
              item: "Group Info",
              icon: <Info size={18} />,
              action: { type: "TOGGLE_GROUP_MODAL" } as const,
            },

            {
              item: "Leave Group",
              icon: <LogOut size={18} />,
              action: { type: "LEAVE" } as const,
            },
          ]
        : []),
      {
        item: "Delete Chat",
        icon: <Trash size={18} />,
        action: { type: "DELETE_CHAT" } as const,
      },
    ],
  };
};

const ChatRoomMenu = ({
  dropdownRef,
  isDropdownOpen,
  handleOptionClick,
  roomInfo,
}: {
  dropdownRef: RefObject<HTMLDivElement>;
  isDropdownOpen: boolean;
  handleOptionClick: (action: MenuAction) => void;
  roomInfo: {
    blockedUserId: string | null;
    oppositeUserId: string | null;
    removedAt: string | null;
    isGroup: boolean;
  };
}) => {
  const options = roomInfo.isGroup
    ? createMenuConfig(roomInfo.oppositeUserId, roomInfo.removedAt, null).group
    : createMenuConfig(
        roomInfo.oppositeUserId,
        null,
        roomInfo.blockedUserId
      ).regular;

      
  return (
    <div
      ref={dropdownRef}
      className={
        "absolute top-full z-50 origin-top right-0 mt-2 w-fit border-2 border-gray-700 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700 " +
        (isDropdownOpen ? "transition-transform duration-200" : "scale-y-0")
      }
    >
      <div className="py-1">
        {options.map(({ item, icon, action }) => (
          <button
            onClick={() => handleOptionClick(action)}
            key={item}
            className="group flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:bg-gray-700 focus:text-white"
          >
            <span className="mr-3 text-gray-400 group-hover:text-white">
              {icon}
            </span>
            <span className="flex-grow text-left">{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomMenu;
