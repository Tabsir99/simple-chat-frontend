"use client";
import React, { useState } from "react";
import {
  Users,
  UserPlus,
  UserX,
  CircleDashed,
  Check,
  X,
  Ban,
  Shield,
} from "lucide-react";
import ConfirmationModal from "@/components/ui/confirmationModal";
import Image from "next/image";



export default function FriendList() {
  const [activeTab, setActiveTab] = useState<"friends"|"pending"|"blocked">("friends");
  const connections: { userId: string; username: string; status: "online" | "offline" | "pending" | "blocked"; profilePicture: string }[] = [
    
  ];

  // Mock data
  const friends: { userId: string, username: string, status: "online" | "offline" | "pending" | "blocked", profilePicture: string }[] = [
    {
      userId: '1',
      username: "Alex Johnson",
      status: "online",
      profilePicture: "",
    },
    {
      userId: '2',
      username: "Sam Smith",
      status: "offline",
      profilePicture: "",
    },
  ];

  const pendingRequests: { userId: string, username: string, status: "online" | "offline" | "pending" | "blocked", profilePicture: string }[] = [
    {
      userId: '3',
      username: "Jamie Lee",
      status: "pending",
      profilePicture: "",
    },
    {
      userId: '4',
      username: "Taylor Swift",
      status: "pending",
      profilePicture: "",
    },
  ];

  const blockedUsers: { userId: string, username: string, status: "online" | "offline" | "pending" | "blocked", profilePicture: string }[] = [
    {
      userId: '5',
      username: "Chris Brown",
      status: "blocked",
      profilePicture: "",
    },
  ];

  const tabs: {id: "friends"|"pending"|"blocked", icon: any, label: string, count: number}[] = [
    { id: "friends", icon: Users, label: "Friends", count: connections.filter(connection => connection.status === "online" || connection.status === "offline").length },
    {
      id: "pending",
      icon: UserPlus,
      label: "Pending",
      count: connections.filter(connection => connection.status === "pending").length,
    },
    {
      id: "blocked",
      icon: UserX,
      label: "Blocked",
      count: connections.filter(connection => connection.status === "blocked").length,
    },
  ];

  const handleAction = (action: "accept"|"reject"|"block"|"unblock", userId:string) => {
    console.log(`${action}:`, userId);
  };

 

  

  const renderConnections = () => {
    const filteredUsers = connections.filter(user => {
    switch (activeTab) {
      case "friends":
        return user.status === "online" || user.status === "offline";
      case "pending":
        return user.status === "pending";
      case "blocked":
        return user.status === "blocked";
      default:
        return false;
    }
  });

    if (filteredUsers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
          <CircleDashed className="w-8 h-8 mb-2" />
          <p>No {activeTab} found</p>
        </div>
      );
    }

    return filteredUsers.map((item) => (
      <FriendItem
        key={item.userId}
        {...item}
        onAccept={() => handleAction("accept", item.userId)}
        onReject={() => handleAction("reject", item.userId)}
        onBlock={() => handleAction("block", item.userId)}
        onUnblock={() => handleAction("unblock", item.userId)}
      />
    ));
  };

  return (
    <div className="bg-gray-900/70 p-6 h-full w-full border-l-2 border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Friends List</h2>

      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <CustomButton
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className="relative"
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
            {tab.count > 0 && tab.id === "pending" && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </CustomButton>
        ))}
      </div>

      <div className= "gap-3 grid grid-cols-2 items-center">{connections.length === 0? <NoConnectionsMessage type={activeTab} />:renderConnections()}</div>
    </div>
  );
}



























const NoConnectionsMessage = ({ type }: {type: "friends"|"pending"|"blocked"}) => {
  const messages = {
    friends: {
      icon: <Users className="text-blue-400" size={48} />,
      title: "No Friends Yet",
      message: "Start connecting with people to build your network!",
      action: "Find Friends"
    },
    pending: {
      icon: <UserPlus className="text-green-400" size={48} />,
      title: "No Pending Requests",
      message: "You're all caught up! No friend requests waiting.",
      action: "Discover People"
    },
    blocked: {
      icon: <UserX className="text-red-400" size={48} />,
      title: "No Blocked Users",
      message: "Your block list is empty. Enjoy a positive experience!",
      action: "Go to chats"
    }
  };

  const content = messages[type];

  return (
    <div className="col-span-2 flex justify-center items-center">
      <div className="text-center p-8 bg-gray-800/50 rounded-xl w-full max-w-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
        <div className="mb-6 flex justify-center">
          {content.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-3">
          {content.title}
        </h3>
        <p className="text-gray-300 mb-6">
          {content.message}
        </p>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md font-semibold transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
          {content.action}
        </button>
      </div>
    </div>
  );
};


interface FriendItemProps {
  username: string;
  status: "online"|"offline"|"pending"|"blocked";
  profilePicture: string;
  onAccept: () => void;
  onReject: () => void;
  onBlock: () => void;
  onUnblock: () => void;
}


const FriendItem = ({
  username,
  status,
  profilePicture,
  onAccept,
  onReject,
  onBlock,
  onUnblock,
}: FriendItemProps) => {
  const [showBlockModal, setShowBlockModal] = useState(false);

  const getStatusStyles = (status: "online"|"offline"|"pending"|"blocked") => {
    const styles = {
      online: { dot: "bg-emerald-500", text: "text-emerald-400" },
      offline: { dot: "bg-slate-500", text: "text-slate-400" },
      pending: { dot: "bg-amber-500", text: "text-amber-400" },
      blocked: { dot: "bg-red-500", text: "text-red-400" },
    };
    return styles[status] || styles.offline;
  };

  const statusStyles = getStatusStyles(status);

  const renderActions = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <div className="flex gap-2">
            <CustomButton variant="success" size="sm" onClick={onAccept}>
              <Check className="w-4 h-4" />
            </CustomButton>
            <CustomButton variant="danger" size="sm" onClick={onReject}>
              <X className="w-4 h-4" />
              
            </CustomButton>
          </div>
        );
      case "blocked":
        return (
          <CustomButton variant="outline" size="sm" onClick={onUnblock}>
            <Shield className="w-4 h-4 mr-1.5" />
            Unblock
          </CustomButton>
        );
      case "online":
      case "offline":
        return (
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setShowBlockModal(true)}
            className="text-red-400 hover:text-red-300"
          >
            <Ban className="w-4 h-4 mr-1.5" />
            Block
          </CustomButton>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-80 rounded-xl transition-all duration-200">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <Image
                className="w-full h-full object-cover"
                src={profilePicture}
                alt={username}
                width={50}
                height={50}
              />
            ) : (
              <span className="text-white text-lg font-medium">
                {username.charAt(0)}
              </span>
            )}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${statusStyles.dot}`}
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-white font-medium truncate">{username}</h3>
          <p className={`${statusStyles.text} text-sm font-medium`}>{status}</p>
        </div>
        <div className="flex items-center shrink-0">{renderActions()}</div>
      </div>

      <ConfirmationModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={`Block ${username}?`}
        actions={
          <>
            <CustomButton
              variant="ghost"
              onClick={() => setShowBlockModal(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="danger"
              onClick={() => {
                onBlock();
                setShowBlockModal(false);
              }}
            >
              Block User
            </CustomButton>
          </>
        }
      >
        This will remove them from your friends list and block all future
        interactions.
      </ConfirmationModal>
    </>
  );
};










interface CustomButtonProps {
  variant?: "default" | "danger" | "success" | "ghost" | "outline";
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  size?: "default" | "sm";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "default",
  children,
  onClick,
  className = "",
  size = "default",
}) => {
  const baseStyles =
    "rounded-md font-medium transition-all duration-200 flex items-center justify-center";
  const sizeStyles = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
  };
  const variantStyles = {
    default: "bg-white text-slate-900 hover:bg-slate-100 border border-transparent",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "bg-transparent hover:bg-white/10 text-white",
    outline:
      "bg-transparent border border-slate-700 text-white hover:bg-white/5",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
