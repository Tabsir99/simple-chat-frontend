"use client";

import {
  CircleUser,
  Users,
  EyeOff,
  Briefcase,
  Calendar,
} from "lucide-react";
import useCustomSWR from "../hooks/customSwr";
import { useAuth } from "../authComps/authcontext";
import { IUserProfile } from "@/types/userTypes";
import { useEffect, useState } from "react";
import Image from "next/image";
import NoUserFound from "./nouser";
import { useRouter } from "next/navigation";
import AddFriendBtn from "./addFriendbutton";
import UserStats from "./userstats";

const UserPublicProfile = ({ userId }: { userId: string | null }) => {
  const defaultProfile: IUserProfile = {
    email: "",
    createdAt: "",
    username: "",
    bio: "",
    profilePicture: "",
    title: "",
    totalChats: 0,
    totalFriends: 0,
    totalMessageSent: 0,
    status: "",
    isSender: false
  };
  const { checkAndRefreshToken } = useAuth();
  const [userProfile, setUserProfile] = useState<IUserProfile>(defaultProfile);
  const router = useRouter();

  const { data, error, isLoading } = useCustomSWR<{
    userInfo: IUserProfile;
    isOwnProfile: boolean;
  }>(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}` );

  const LoadingPlaceholder = ({
    width,
    height,
  }: {
    width: string;
    height: string;
  }) => (
    <div
      className={`bg-gray-700 animate-pulse rounded ${width} ${height}`}
    ></div>
  );
  useEffect(() => {
    console.log(data)
    if (data) {
      if (data.isOwnProfile) {
        return router.push("/profile");
      }
      
      return setUserProfile(data.userInfo);
    }
    if (error) {
      console.log(error,"FRom error")
      setUserProfile(defaultProfile);
    }
  }, [data]);

  if(!isLoading && data?.isOwnProfile){
    return null
  }

  if (!userProfile.email && !isLoading) {
    return <NoUserFound />;
  }

  return (
    <div className="h-screen bg-gray-900 text-gray-100 p-8 overflow-y-scroll">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Profile</h1>

        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            {/* Avatar */}
            <div className="relative mb-6 md:mb-0 md:mr-8">
              {isLoading ? (
                <LoadingPlaceholder width="w-36" height="h-36" />
              ) : userProfile?.profilePicture ? (
                <Image
                  src={userProfile.profilePicture}
                  alt="user profile picture"
                  width={144}
                  height={144}
                  className="rounded-full"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gray-700 flex justify-center items-center text-4xl font-bold">
                  {userProfile?.username?.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">
                {userProfile.username}
              </h2>
              <div className="flex justify-center md:justify-start items-center mb-4">
                <CircleUser className="w-5 h-5 mr-2 text-gray-400" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex justify-center md:justify-start items-center mb-4">
                <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
                <span>
                  {userProfile.title || (
                    <span className="text-gray-400"> NO TITLE </span>
                  )}
                </span>
              </div>
              <div className="flex justify-center md:justify-start items-center mb-4">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                <span>{userProfile.createdAt}</span>
              </div>

              {/* Inline Quick Actions */}
              <AddFriendBtn
                userId={userId}
                status={userProfile.status}
                isSender={userProfile.isSender}
                checkAndRefreshToken={checkAndRefreshToken}
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Bio</h3>
          <p className="text-gray-300 mb-4">{userProfile.bio || "No Bio"}</p>

          {/* Anonymous Chat */}
        </div>

        {/* Activity Stats */}

        <UserStats
          userStats={{
            totalChats: userProfile.totalChats,
            totalFriends: userProfile.totalFriends,
            totalMessage: userProfile.totalMessageSent,
          }}
        />

        {/* Add to Group Button */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 gap-10 flex justify-stretch items-center">
          <button className="bg-gray-900 w-full hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 mr-2" />
            Add to Group
          </button>
          <button className="bg-gray-900 w-full justify-center hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center">
            <EyeOff className="w-5 h-5 mr-2" />
            Start Anonymous Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPublicProfile;
