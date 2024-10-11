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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaModal from "./mediaModal";
import { useChatContext } from "../../contextProvider/chatContext";
import Image from "next/image";
import { GroupInfoModal } from "./groupInfoModal";
import { IChatHead } from "@/types/chatTypes";

const options = [
  {
    item: "Profile",
    icon: <User className="text-gray-400" size={18} />,
  },
  { item: "Media", icon: <ImageIcon className="text-gray-400" size={18} /> },
  { item: "Favorite", icon: <Heart className="text-gray-400" size={18} /> },
  { item: "Block", icon: <Ban className="text-gray-400" size={18} /> },
];

const groupChatOptions = [
  {
    item: "Group",
    icon: <Info className="text-gray-400" size={18} />,
  },
  { item: "Favorite", icon: <Heart className="text-gray-400" size={18} /> },
  {
    item: "Mute",
    icon: <BellOff className="text-gray-400" size={18} />,
  },
  { item: "Leave", icon: <LogOut className="text-gray-400" size={18} /> },
];

export default function ChatHeader({ selectedActiveChat }: { selectedActiveChat: IChatHead }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


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

  const handleOptionClick = (option: string) => {

    if (option === "Profile") {
      return router.push(`/search-people/${selectedActiveChat?.oppositeUser.userId}`);
    }
    if (option === "Media") {
      toggleMediaModal();
    }
    if (option === "Group") {
      console.log(option);
      setGroupModal(true);
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
              href={`/search-people/${selectedActiveChat.oppositeUser.userId}`}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400"
            >
              {selectedActiveChat.oppositeUser.profilePicture ? (
                <Image
                  src={selectedActiveChat.oppositeUser.profilePicture}
                  alt="profile picture"
                />
              ) : (
                <span className="text-[18px] uppercase">
                  {" "}
                  {selectedActiveChat.oppositeUser.username.slice(0, 2)}{" "}
                </span>
              )}
            </Link>
            <div className="capitalize">
              <h2 className="text-white text-[18px] font-semibold">
                {selectedActiveChat.roomName || selectedActiveChat.oppositeUser.username}
              </h2>
              {selectedActiveChat.oppositeUser.userStatus === "online" ? (
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
            options={groupChatOptions}
          />
        ) : (
          <ChatRoomMenu
            options={options}
            dropdownRef={dropdownRef}
            handleOptionClick={handleOptionClick}
            isDropdownOpen={isDropdownOpen}
          />
        )}
      </div>

      {isMediaModalOpen && <MediaModal toggleMediaModal={toggleMediaModal} />}



      {groupModal && (
        <GroupInfoModal
        isOpen={groupModal}
          groupData={ {
            name: selectedActiveChat.roomName,
            description: selectedActiveChat.roomName,
            members: [
              { name: "John Doe", role: "Project Manager", status: "online", isAdmin: true },
              { name: "Jane Smith", role: "Developer", status: "online", isModerator: true },
              { name: "Mike Johnson", role: "Designer", status: "offline" },
              { name: "Emily Brown", role: "Marketing", status: "online" },
              { name: "Alex Turner", role: "QA Tester", status: "offline" },
              { name: "Olivia Wilson", role: "Developer", status: "online" },
            ],
            media: [
              { url: "https://picsum.photos/200/200?random=1" },
              { url: "https://picsum.photos/200/200?random=2" },
              { url: "https://picsum.photos/200/200?random=3" },
              { url: "https://picsum.photos/200/200?random=4" },
              { url: "https://picsum.photos/200/200?random=5" },
              { url: "https://picsum.photos/200/200?random=6" },
            ],
            links: [
              { title: "Project Roadmap", url: "https://example.com/roadmap" },
              { title: "Design Assets", url: "https://example.com/design-assets" },
              { title: "API Documentation", url: "https://example.com/api-docs" },
            ],
          }
          }
          onClose={closeGroupModal}
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
  handleOptionClick: (item: string) => void;
  options: Array<{ item: string; icon: ReactNode }>;
}) => {
  return (
    <div
      ref={dropdownRef}
      className={
        "absolute py-2 w-32 z-40 top-full right-0 mt-2 bg-gray-800 text-white rounded-lg shadow-xl px-3 border border-gray-600 overflow-hidden origin-top " +
        (isDropdownOpen ? "transition-transform duration-200" : "scale-y-0")
      }
    >
      {options.map(({ item, icon }) => (
        <button
          key={item}
          className="w-full rounded-lg text-left px-3 py-2.5 flex gap-1 text-[18px] items-center hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors duration-200"
          onClick={() => handleOptionClick(item)}
        >
          {icon}
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
};
