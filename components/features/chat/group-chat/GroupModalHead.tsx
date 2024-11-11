import { Image, Link, Users, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const GroupModalHead = ({
  roomName,
  onClose,
  activeTab,
  setActiveTab,
  totalMembers=2,
}: {
  roomName: string;
  onClose: () => void;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  totalMembers: number
}) => {
  const tabs = [
    { id: "members", label: "Members", icon: <Users size={18} /> },
    { id: "attachments", label: "Attachments", icon: <Image size={18} /> },
  ];

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {roomName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl capitalize text-white">{roomName}</h2>
            <p className="text-sm text-gray-400">
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
