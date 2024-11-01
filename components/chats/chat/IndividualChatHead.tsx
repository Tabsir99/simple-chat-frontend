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
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaModal from "./mediaModal";
import Image from "next/image";
import { ChatRoomMember, GroupInfoModal } from "./groupInfoModal";
import { IChatHead, MenuItem, MenuAction } from "@/types/chatTypes";
import { ecnf } from "@/utils/env";
import { useAuth } from "@/components/authComps/authcontext";
import { mutate as globalMutate } from "swr";
import { useNotification } from "@/components/contextProvider/notificationContext";
import useCustomSWR from "@/components/hooks/customSwr";
import useFriendshipActions from "@/components/hooks/useFriendshipActions";
import ConfirmationModal from "@/components/ui/confirmationModal";
import { AllMessageResponse } from "@/types/responseType";
import { useChatContext } from "@/components/contextProvider/chatContext";

// Create menu configurations
const createMenuConfig = (
  userId?: string,
  removedAt?: string,
  blockedUserId?: string
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

export default function ChatHeader({
  selectedActiveChat,
}: {
  selectedActiveChat: IChatHead;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { checkAndRefreshToken, user } = useAuth();
  const { showNotification } = useNotification();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { setActiveChats } = useChatContext()

  const { data, mutate } = useCustomSWR<ChatRoomMember[]>(
    `${ecnf.apiUrl}/chats/${selectedActiveChat.chatRoomId}/members`,
    { revalidateIfStale: false }
  );

  const { handleFriendshipAction } = useFriendshipActions();

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
    setIsGroupModalOpen(false);
  };

  const handleOptionClick = async (action: MenuAction) => {
    switch (action.type) {
      case "NAVIGATE":
        router.push(action.path);
        break;

      case "TOGGLE_MEDIA":
        toggleMediaModal();
        break;

      case "TOGGLE_GROUP_MODAL":
        setIsGroupModalOpen(true);
        break;

      case "CREATE_GROUP":
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
              userId: selectedActiveChat.oppositeUserId,
              username: selectedActiveChat.oppositeUsername,
            },
          ]),
        });
        if (response.ok) {
          globalMutate(`${ecnf.apiUrl}/chats`);
        } else {
          showNotification("Could not create a group", "error");
        }
        break;

      case "BLOCK":
        handleFriendshipAction("block", selectedActiveChat.oppositeUserId);
        break;

      case "UNBLOCK":
        handleFriendshipAction("cancel", selectedActiveChat.oppositeUserId);
        break;

      case "DELETE_CHAT":
        setIsConfirmModalOpen(true);
      default:
        break;
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
                  : `/search-people/${selectedActiveChat.oppositeUserId}`
              }
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400"
            >
              {selectedActiveChat.isGroup ? (
                <span className="text-[18px] uppercase">GC</span>
              ) : selectedActiveChat.oppositeProfilePicture ? (
                <Image
                  src={selectedActiveChat.oppositeProfilePicture}
                  alt="profile picture"
                />
              ) : (
                <span className="text-[18px] uppercase">
                  {selectedActiveChat.oppositeUsername?.slice(0, 1)}
                </span>
              )}
            </Link>
            <div className="capitalize">
              <h2 className="text-white text-[18px] font-semibold">
                {selectedActiveChat.isGroup
                  ? selectedActiveChat.roomName
                  : selectedActiveChat.oppositeUsername}
              </h2>
              {selectedActiveChat.isGroup ? (
                <p className="text-[14px] text-green-400"> online </p>
              ) : selectedActiveChat?.oppositeUserStatus === "online" ? (
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

        {selectedActiveChat && selectedActiveChat.isGroup ? (
          <ChatRoomMenu
            dropdownRef={dropdownRef}
            handleOptionClick={handleOptionClick}
            isDropdownOpen={isDropdownOpen}
            options={
              createMenuConfig(
                selectedActiveChat.oppositeUserId as string,
                selectedActiveChat.removedAt || "",
                undefined
              ).group
            }
          />
        ) : (
          <ChatRoomMenu
            options={
              createMenuConfig(
                selectedActiveChat.oppositeUserId as string,
                undefined,
                selectedActiveChat.blockedUserId || undefined
              ).regular
            }
            dropdownRef={dropdownRef}
            handleOptionClick={handleOptionClick}
            isDropdownOpen={isDropdownOpen}
          />
        )}
      </div>

      {isMediaModalOpen && (
        <MediaModal
          toggleMediaModal={toggleMediaModal}
          selectedChatId={selectedActiveChat.chatRoomId}
        />
      )}

      {isGroupModalOpen && (
        <GroupInfoModal
          roomName={selectedActiveChat.roomName as string}
          chatRoomId={selectedActiveChat.chatRoomId}
          onClose={() => {
            closeGroupModal();
          }}
          members={data || []}
          mutate={mutate}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={async () => {
          const token = await checkAndRefreshToken();
          const res = await fetch(
            `${ecnf.apiUrl}/chats/${selectedActiveChat.chatRoomId}`,
            {
              method: "DELETE",
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.ok) {
            globalMutate(
              `${ecnf.apiUrl}/chats/${selectedActiveChat.chatRoomId}/messages`,
              (current: AllMessageResponse | undefined) => {
                if(!current) return current
                return {
                  allReceipts: [],
                  attachments: [],
                  messages: []
                }
              },false
            );
            setActiveChats(prev => {
              if(!prev) return prev
              return prev.map(chat => {
                if(chat.chatRoomId !== selectedActiveChat.chatRoomId) return chat
                return {
                  ...chat,
                  chatClearedAt: new Date().toISOString(),
                  unreadCount: 0,
                }
              })
            })
            router.push("/chats")
            
            showNotification("Chat cleared!","success")
          } else {
            showNotification(
              "Something went wrong, Could not clear chat",
              "error"
            );
          }
        }}
        confirmBtnText="Delete chat"
        title="Are you sure, You want to clear the chat?"
        children="Deleting a chat would mean, you lose all the messages and files shared upto this point."
      />
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
