"use client";
import {
  useState,
  MouseEvent,
  useEffect,
  useRef,
  RefObject,
  ReactNode,
} from "react";
import {
  MoreVertical,
  Search,
  User,
  Ban,
  Heart,
  ImageIcon,
  Info,
  BellOff,
  LogOut,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaModal from "./mediaModal";
import Image from "next/image";
import { GroupInfoModal } from "./groupInfoModal";
import { IChatHead } from "@/types/chatTypes";
import { ecnf } from "@/utils/env";
import { useAuth } from "@/components/authComps/authcontext";
import { mutate } from "swr";
import { useNotification } from "@/components/contextProvider/notificationContext";

type MenuAction =
  | { type: "NAVIGATE"; path: string }
  | { type: "TOGGLE_MEDIA" }
  | { type: "TOGGLE_GROUP_MODAL" }
  | { type: "MUTE" }
  | { type: "LEAVE" }
  | { type: "BLOCK" }
  | { type: "CREATE_GROUP" }
  | { type: "CLOSE" };

// Define menu item interface
interface MenuItem {
  item: string;
  icon: ReactNode;
  action: MenuAction;
}

// Create menu configurations
const createMenuConfig = (
  userId?: string
): Record<"regular" | "group", MenuItem[]> => ({
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
    {
      item: "Block",
      icon: <Ban size={18} />,
      action: { type: "BLOCK" },
    },
    {
      item: "Create Group",
      icon: <Users size={18} />,
      action: { type: "CREATE_GROUP" },
    },
  ],
  group: [
    {
      item: "Group Info",
      icon: <Info size={18} />,
      action: { type: "TOGGLE_GROUP_MODAL" },
    },
    {
      item: "Mute",
      icon: <BellOff size={18} />,
      action: { type: "MUTE" },
    },
    {
      item: "Leave Group",
      icon: <LogOut size={18} />,
      action: { type: "LEAVE" },
    },
  ],
});

export default function ChatHeader({
  selectedActiveChat,
}: {
  selectedActiveChat: IChatHead;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { checkAndRefreshToken, user } = useAuth();
  const { showNotification } = useNotification();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMediaModal = () => {
    setIsMediaModalOpen((prev) => !prev);
  };

  const closeGroupModal = () => {
    setGroupModal(false);
  };

  const handleOptionClick = async (action: MenuAction) => {
    if (action.type === "NAVIGATE") {
      return router.push(action.path);
    }
    if (action.type === "TOGGLE_MEDIA") {
      toggleMediaModal();
    }
    if (action.type === "TOGGLE_GROUP_MODAL") {
      setGroupModal(true);
    }
    if (action.type === "CREATE_GROUP") {
      const token = await checkAndRefreshToken();
      const response = await fetch(`${ecnf.apiUrl}/chats/groups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            userId: user?.userId,
            username: user?.username,
          },
          {
            userId: selectedActiveChat.privateChatMemberId,
            username: selectedActiveChat.roomName,
          },
        ]),
      });
      if (response.ok) {
        mutate(`${ecnf.apiUrl}/chats`);
      } else {
        showNotification("Could not create a group", "error");
      }
    }
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener
      );
    };
  }, [selectedActiveChat]);

  return (
    <div className="bg-[#1f2329] flex items-center justify-between h-16 px-4 py-2 border-b-2  border-gray-700 relative">
      <div className="flex items-center space-x-4">
        {!selectedActiveChat ? (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-700 animate-shimmer bg-200% bg-shimmer" />
            <div>
              <div className="h-[22px] w-32 bg-gray-700 rounded animate-shimmer bg-200% bg-shimmer" />
              <div className="h-[18px] w-16 bg-gray-700 rounded mt-1 animate-shimmer bg-200% bg-shimmer" />
            </div>
          </>
        ) : (
          <>
            {" "}
            <Link
              href={
                selectedActiveChat.isGroup
                  ? "#"
                  : `/search-people/${selectedActiveChat.privateChatMemberId}`
              }
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400"
            >
              {selectedActiveChat.isGroup ? (
                <span className="text-[18px] uppercase">GC</span>
              ) : selectedActiveChat.roomImage ? (
                <Image
                  src={selectedActiveChat.roomImage}
                  alt="profile picture"
                />
              ) : (
                <span className="text-[18px] uppercase">
                  {selectedActiveChat.roomName.slice(0, 1)}
                </span>
              )}
            </Link>
            <div className="capitalize">
              <h2 className="text-white text-[18px] font-semibold">
                {selectedActiveChat.roomName}
              </h2>
              {selectedActiveChat.roomStatus === "online" ? (
                <p className="text-[14px] text-green-400"> online </p>
              ) : (
                <p className="text-[14px] text-gray-400"> offline </p>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4 relative">
        <div className="px-2 bg-[#292f36] rounded-md text-[16px] flex justify-center items-center">
          <input
            type="search"
            className="p-2 bg-transparent outline-none"
            placeholder="Search chat..."
          />
          <button
            className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
            onClick={() => {}}
          >
            <Search size={24} />
          </button>
        </div>
        <button
          className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
          onClick={toggleDropdown}
        >
          <MoreVertical size={24} />
        </button>

        {selectedActiveChat?.isGroup ? (
          <ChatRoomMenu
            dropdownRef={dropdownRef}
            handleOptionClick={handleOptionClick}
            isDropdownOpen={isDropdownOpen}
            options={
              createMenuConfig().group
            }
          />
        ) : (
          <ChatRoomMenu
            options={createMenuConfig(selectedActiveChat.privateChatMemberId as string).regular}
            dropdownRef={dropdownRef}
            handleOptionClick={handleOptionClick}
            isDropdownOpen={isDropdownOpen}
          />
        )}
      </div>

      {isMediaModalOpen && <MediaModal toggleMediaModal={toggleMediaModal} selectedChatId={selectedActiveChat.chatRoomId} />}

      {groupModal && (
        <GroupInfoModal
          isOpen={groupModal}
          groupData={{
            roomName: selectedActiveChat.roomName,
            description: selectedActiveChat.roomName,
          }}
          onClose={() => {
            closeGroupModal();
          }}
          selectedChatId={selectedActiveChat.chatRoomId}
        />
      )}
    </div>
  );
}

const ChatRoomMenu = ({
  dropdownRef,
  isDropdownOpen,
  handleOptionClick,
  options,
}: {
  dropdownRef: RefObject<HTMLDivElement>;
  isDropdownOpen: boolean;
  handleOptionClick: (action: MenuAction) => void;
  options: MenuItem[];
}) => {
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
