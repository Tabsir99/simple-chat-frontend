import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import { Image, Link, Users, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const GroupModalHead = ({
  roomName,
  onClose,
  activeTab,
  setActiveTab,
  totalMembers=2,
  roomImage,
}: {
  roomName: string;
  onClose: () => void;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  totalMembers: number
  roomImage: string | null
}) => {
  const tabs = [
    { id: "members", label: "Members", icon: <Users size={18} /> },
    { id: "attachments", label: "Attachments", icon: <Image size={18} /> },
  ];

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar avatarName={roomName} profilePicture={roomImage} />
          <div className="flex flex-col gap-0 leading-none">
            <h2 className="text-xl capitalize text-white max-sm:text-[18px] ">{roomName}</h2>
            <p className="text-sm text-gray-400 max-sm:text-[14px] ">
              {totalMembers} members
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center border-b-2 justify-center space-x-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? "text-blue-500 border-blue-500"
                : "text-gray-400 hover:text-white border-transparent"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default GroupModalHead;
