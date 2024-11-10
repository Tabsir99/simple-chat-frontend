"use client";

import {
  CircleUser,
  Users,
  EyeOff,
  Calendar,
  ShieldOff,
  MapPin,
  Mail,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import useCustomSWR from "../shared/hooks/common/customSwr";
import { IUserProfile } from "@/types/userTypes";
import { useEffect, useState } from "react";
import Image from "next/image";
import NoUserFound from "./nouser";
import { useRouter } from "next/navigation";
import AddFriendBtn from "./addFriendbutton";
import UserStats from "./userstats";
import FullPageLoader from "../ui/fullpageloader";
import { ecnf } from "@/utils/env";

const UserPublicProfile = ({ userId }: { userId: string | null }) => {
  const defaultProfile: IUserProfile = {
    email: "",
    createdAt: "",
    username: "",
    bio: "",
    profilePicture: "",
    totalChats: 0,
    totalFriends: 0,
    totalMessageSent: 0,
    status: "canceled",
    isCurrentUserSender: false,
    isCurrentUserBlocked: false,
    isLoading: true,
  };
  
  const [userProfile, setUserProfile] = useState<IUserProfile>(defaultProfile);
  const router = useRouter();

  const { data, error } = useCustomSWR<{
    userInfo: IUserProfile;
    isOwnProfile: boolean;
  }>(`${ecnf.apiUrl}/users/${userId}`, {});

  const updateSender = (value: boolean) => {
    setUserProfile((prev) => ({ ...prev, isCurrentUserSender: value }));
  };

  useEffect(() => {
    if (error) {
      defaultProfile.isLoading = false;
      defaultProfile.isCurrentUserBlocked = true;
      setUserProfile(defaultProfile);
      return;
    }

    if (data) {
      if (data.isOwnProfile) {
        return router.push("/profile");
      }
      data.userInfo.isLoading = false;
      return setUserProfile(data.userInfo);
    }
  }, [data, error]);

  if (userProfile.isLoading) {
    return <FullPageLoader className="min-h-screen" height="100%" width="100%" />;
  }

  if (!userProfile.email && !userProfile.isLoading) {
    return <NoUserFound />;
  }

  if (userProfile.isCurrentUserBlocked) {
    return (
      <div className="h-screen bg-gradient-to-br overflow-y-auto from-gray-900 to-gray-800 flex justify-center items-center p-4">
        <BlockMessage />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll bg-gradient-to-br  from-gray-900 to-gray-800 text-gray-100 py-8 px-4 sm:px-6 lg:px-1 xl2:px-8 ">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Overview */}
        

        {/* Main Profile Card */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 backdrop-blur-lg bg-opacity-50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative">
              {userProfile?.profilePicture ? (
                <div className="relative w-40 h-40">
                  <Image
                    src={userProfile.profilePicture}
                    alt="Profile picture"
                    fill
                    className="rounded-full object-cover border-4 border-gray-700"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex justify-center items-center text-4xl font-bold border-4 border-gray-700">
                  {userProfile?.username?.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-grow space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold">{userProfile.username}</h2>
              <div className="space-y-2">
                <InfoRow icon={<Mail className="w-5 h-5" />} text={userProfile.email} />
                <InfoRow
                  icon={<Calendar className="w-5 h-5" />}
                  text={userProfile.createdAt}
                />
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <AddFriendBtn
                  user={{ userId, username: userProfile.username }}
                  status={userProfile.status}
                  isCurrentUserSender={userProfile.isCurrentUserSender}
                  isCurrentUserBlocked={userProfile.isCurrentUserBlocked}
                  updateSender={updateSender}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 backdrop-blur-lg bg-opacity-50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            About
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {userProfile.bio || "No bio available"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-blue-400" />}
            label="Messages"
            value={userProfile.totalMessageSent}
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-green-400" />}
            label="Friends"
            value={userProfile.totalFriends}
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-purple-400" />}
            label="Active Chats"
            value={userProfile.totalChats}
          />
        </div>
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionButton
            icon={<Users className="w-5 h-5" />}
            text="Add to Group"
            onClick={() => {}}
          />
          <ActionButton
            icon={<EyeOff className="w-5 h-5" />}
            text="Anonymous Chat"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="bg-gray-800 rounded-xl p-4 shadow-lg backdrop-blur-lg bg-opacity-50">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 text-gray-300">
    {icon}
    <span>{text}</span>
  </div>
);

const ActionButton = ({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full"
  >
    {icon}
    <span>{text}</span>
  </button>
);

const BlockMessage = () => (
  <div className="max-w-md w-full mx-auto p-8 rounded-xl bg-gray-800 shadow-xl backdrop-blur-lg bg-opacity-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ShieldOff size={48} className="text-red-500" />
        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
      </div>
      <h2 className="text-2xl font-bold text-center text-white">Access Restricted</h2>
      <p className="text-gray-300 text-center">
        You've been blocked by this user. Unable to view their profile or interact at this time.
      </p>
    </div>
  </div>
);

export default UserPublicProfile;