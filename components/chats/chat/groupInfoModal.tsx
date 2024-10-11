import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  X,
  Users,
  UserPlus,
  UserMinus,
  Image,
  Link,
  Search,
  MoreHorizontal,
  MessageCircle,
  Crown,
  Shield,
} from "lucide-react";




export const GroupInfoModal = ({
  onClose,
  groupData,
}: {
  isOpen: boolean;
  onClose: () => void;
  groupData: any;
}) => {
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [translateClass, setTranslateClass] = useState("translateX(100%)");

  const filteredMembers = groupData.members.filter((member: any) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedMember, setSelectedMember] = useState(null);

  const handleAddMember = () => {
    // Implement your add member logic here
    console.log("Add member clicked");
  };

  const handleMemberAction = (action: string, member: any) => {
    console.log(`${action} clicked for ${member.name}`);
    setSelectedMember(null);
  };

  useEffect(() => {
    setTranslateClass("translateX(0)");
  }, []);
  return (
    <div className="fixed w-screen h-screen z-50 bg-black bg-opacity-60 left-0 top-0">
      <div
        className="fixed inset-y-0 right-0 w-[40rem] border-l-2 border-gray-700 bg-gray-900 shadow-lg transform transition-transform duration-300 z-50"
        style={{ transform: translateClass }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <GroupInfoModalHeader
            groupData={groupData}
            activeTab={activeTab}
            onClose={onClose}
            setActiveTab={setActiveTab}
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
                    onClick={handleAddMember}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <UserPlus size={18} />
                    <span>Add Member</span>
                  </button>
                </div>

                {filteredMembers.map((member: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                          {member.name.charAt(0)}
                        </div>
                        {member.status === "online" && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-white font-medium">
                          {member.name}
                        </span>
                        <p className="text-xs text-gray-400">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {member.isAdmin && (
                        <span className="text-gray-300 text-[16px] flex items-center gap-1 px-3 py-2 bg-gray-900 rounded-md ">
                          Admin <Crown size={16} className="text-yellow-500" />
                        </span>
                      )}
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-white"
                          onClick={() =>
                            setSelectedMember(
                              selectedMember === member ? null : member
                            )
                          }
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {selectedMember === member && (
                          <MemberAction
                            handleMemberAction={handleMemberAction}
                            member={member}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "media" && (
              <div className="grid grid-cols-3 gap-2">
                {groupData.media.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "links" && (
              <div className="space-y-2">
                {groupData.links.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition duration-150"
                  >
                    <h3 className="text-white font-medium">{link.title}</h3>
                    <p className="text-blue-400 text-sm">{link.url}</p>
                  </a>
                ))}
              </div>
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
  );
};

const GroupInfoModalHeader = ({
  groupData,
  onClose,
  activeTab,
  setActiveTab,
}: {
  groupData: any;
  onClose: () => void;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}) => {
  const tabs = [
    { id: "members", label: "Members", icon: <Users size={18} /> },
    { id: "media", label: "Media", icon: <Image size={18} /> },
    { id: "links", label: "Links", icon: <Link size={18} /> },
  ];

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {groupData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{groupData.name}</h2>
            <p className="text-sm text-gray-400">
              {groupData.members.length} members
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

const MemberAction = ({
  member,
  handleMemberAction,
}: {
  member: any;
  handleMemberAction: (type: string, member: object) => void;
}) => {
  return (
    <div className="absolute right-0 mt-2 w-56 px-4 rounded-lg overflow-hidden shadow-lg bg-gray-800 ring-1 ring-gray-700 z-10">
      <div className="py-2" role="menu" aria-orientation="vertical">
        <button
          className="flex rounded-md items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
          onClick={() => handleMemberAction("message", member)}
        >
          <MessageCircle size={16} className="mr-3" />
          <span>Message</span>
        </button>
        <button
          className="flex rounded-md items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
          onClick={() => handleMemberAction("promote", member)}
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
          onClick={() => handleMemberAction("remove", member)}
        >
          <UserMinus size={16} className="mr-3" />
          <span>Remove from Group</span>
        </button>
      </div>
    </div>
  );
};
