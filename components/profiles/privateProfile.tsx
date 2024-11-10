"use client";
import React, { useEffect, useState } from "react";
import { LogOut, Camera, Edit, UserPlus, Save } from "lucide-react";
import UserInfo from "./userInfo";
import UserStats from "./userstats";
import RecentActivity from "./recentactivites";
import { useAuth } from "../shared/contexts/auth/authcontext";
import useCustomSWR from "../shared/hooks/common/customSwr";
import Image from "next/image";
import { IIsEditing, IUserProfile } from "@/types/userTypes";
import FullPageLoader from "../ui/fullpageloader";
import { ecnf } from "@/utils/env";

export default function PrivateProfile() {
  const defaultProfile: Omit<IUserProfile, "isCurrentUserSender" | "status"> = {
    email: "",
    createdAt: "",
    username: "",
    bio: "",
    profilePicture: "",
    title: "",
    totalChats: 0,
    totalFriends: 0,
    totalMessageSent: 0,
  };
  const { checkAndRefreshToken, loading } = useAuth();

  const [userProfile, setUserProfile] =
    useState<Omit<IUserProfile, "isCurrentUserSender" | "status">>(
      defaultProfile
    );
  const [isEditing, setIsEditing] = useState<IIsEditing>({
    bio: false,
    title: false,
    username: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = await checkAndRefreshToken();
      if (accessToken) {
        await checkAndRefreshToken();
      }
    };

    validateToken();
  }, [checkAndRefreshToken, loading]);
  const { data, error, isLoading } = useCustomSWR<{
    userInfo: IUserProfile;
    isOwnProfile: boolean;
  }>(`${ecnf.apiUrl}/users/me`);

  useEffect(() => {
    if (data) {
      return setUserProfile(data.userInfo);
    }
    if (error) {
      return setUserProfile(defaultProfile);
    }
    setUserProfile(defaultProfile);
  }, [data]);

  const handleBioEdit = () => {
    setIsEditing((prev) => ({
      ...prev,
      bio: true,
    }));
  };
  const handleNameEdit = () => {
    setIsEditing((prev) => ({
      ...prev,
      username: true,
    }));
  };
  const handleTitleEdit = () => {
    setIsEditing((prev) => ({
      ...prev,
      title: true,
    }));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserProfile((prev) => ({ ...prev, bio: e.target.value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile((prev) => ({ ...prev, username: e.target.value }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Implement your save logic here
    // For example:
    // await updateUserProfile({ ...userProfile, bio: editedBio });
    setIsEditing({
      bio: false,
      title: false,
      username: false,
    });
    setIsSaving(false);
  };

  const displayOrDefault = (value: string | undefined, defaultText: string) =>
    value || defaultText;

  if (isLoading || loading) {
    return <FullPageLoader className="" width="100%" height="100%" />;
  }
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center gap-3 max-lg:pl-12 h-12">
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          {(isEditing.bio || isEditing.username) && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-fit sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        {/* Profile Info Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
            {/* Profile Picture Section */}
            <div className="relative">
              {userProfile?.profilePicture ? (
                <Image
                  src={userProfile.profilePicture}
                  alt="user profile picture"
                  width={128}
                  height={128}
                  className="rounded-full min-w-32 min-h-32 object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-700 flex justify-center items-center text-3xl font-bold">
                  {userProfile?.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* User Info Section - Pass full width prop */}
            <div className="w-full">
              <UserInfo
                isEditing={isEditing}
                userInfo={userProfile}
                handleNameEdit={handleNameEdit}
                handleNameChange={handleNameChange}
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 min-h-[120px] relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Bio</h3>
            {!isEditing.bio && (
              <button
                onClick={handleBioEdit}
                className="text-gray-200 hover:text-gray-400 flex items-center gap-1 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <textarea
            className={`w-full bg-gray-800 text-white rounded-lg p-3 outline-none border-2 border-gray-700 focus:border-blue-500 transition-all duration-200 min-h-[100px] resize-y ${
              isEditing.bio
                ? "opacity-100"
                : "opacity-0 absolute pointer-events-none"
            }`}
            value={userProfile?.bio || ""}
            onChange={handleBioChange}
            placeholder="Tell us about yourself..."
          />
          <p className={`text-gray-300 ${isEditing.bio ? "hidden" : "block"}`}>
            {displayOrDefault(
              userProfile?.bio,
              "This user hasn't added a bio yet. Click 'Edit' to add your bio!"
            )}
          </p>
        </div>

        {/* Stats Section - Keep original component */}
        <UserStats
          userStats={{
            totalChats: userProfile?.totalChats,
            totalFriends: userProfile?.totalFriends,
            totalMessage: userProfile?.totalMessageSent,
          }}
        />

        {/* Recent Activity - Keep original component */}
        <RecentActivity />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <UserPlus className="w-5 h-5" />
            <span>Invite Friends</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
