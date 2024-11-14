"use client";

import {
  Users,
  EyeOff,
  Calendar,
  Mail,
  UserPlus,
} from "lucide-react";
import useCustomSWR from "../../shared/hooks/common/customSwr";
import { IUserProfile } from "@/types/userTypes";
import { useEffect, useState } from "react";
import Image from "next/image";
import NoUserFound from "./nouser";
import { useRouter } from "next/navigation";
import AddFriendBtn from "../connections/friendshipControls";
import UserStats from "./userstats";
import FullPageLoader from "../../shared/ui/organisms/fullpageloader";
import { ecnf } from "@/utils/constants/env";
import { CustomButton } from "../../shared/ui/atoms/Button/customButton";
import BlockMessage from "./profileBlocked";

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
    return (
      <FullPageLoader className="min-h-[100dvh]" height="100%" width="100%" />
    );
  }

  if (!userProfile.email && !userProfile.isLoading) {
    return <NoUserFound />;
  }

  if (userProfile.isCurrentUserBlocked) {
    return (
        <BlockMessage />
    );
  }

  return (
    <div className="h-[100dvh] overflow-y-scroll bg-gradient-to-br  from-gray-900 to-gray-800 text-gray-100 py-8 px-4 sm:px-6 lg:px-1 xl2:px-8 ">
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
                <InfoRow
                  icon={<Mail className="w-5 h-5" />}
                  text={userProfile.email}
                />
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

        <UserStats
          userStats={{
            totalChats: userProfile.totalChats,
            totalFriends: userProfile.totalFriends,
            totalMessage: userProfile.totalMessageSent,
          }}
        />
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomButton variant="outline" onClick={() => {}}>
            <Users className="w-5 h-5" />
            <span> Add to Group </span>
          </CustomButton>
          <CustomButton variant="outline" onClick={() => {}}>
            <EyeOff className="w-5 h-5" />
            <span> Anonymous Chat </span>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 text-gray-300">
    {icon}
    <span>{text}</span>
  </div>
);

export default UserPublicProfile;
