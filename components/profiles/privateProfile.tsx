"use client";
import React, { useEffect, useState } from "react";
import { LogOut, Camera, Edit, UserPlus, Save } from "lucide-react";
import UserInfo from "./userInfo";
import UserStats from "./userstats";
import RecentActivity from "./recentactivites";
import { useAuth } from "../authComps/authcontext";
import useCustomSWR from "../hooks/customSwr";
import Image from "next/image";
import { IIsEditing, IUserProfile } from "@/types/userTypes";
import FullPageLoader from "../ui/fullpageloader";
import { ecnf } from "@/utils/env";

export default function PrivateProfile() {
  const defaultProfile: Omit<IUserProfile, 'isCurrentUserSender' | 'status'> = {
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

  const [userProfile, setUserProfile] = useState<Omit<IUserProfile, 'isCurrentUserSender' | 'status'>>(defaultProfile);
  const [isEditing, setIsEditing] = useState<IIsEditing>({
    bio: false,
    title: false,
    username: false, 
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = await checkAndRefreshToken()
      if (accessToken) {
        await checkAndRefreshToken();
      }
    };

    validateToken();
  },[checkAndRefreshToken, loading])
  const { data, error, isLoading } = useCustomSWR<{userInfo: IUserProfile, isOwnProfile: boolean}>(
    `${ecnf.apiUrl}/users/me`,
  );
 
  useEffect(() => {
  
    console.log("ran") 
    if (data) {
      return setUserProfile(data.userInfo);
    }
    if (error) {
      return setUserProfile(defaultProfile);
    }
    setUserProfile(defaultProfile)
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

  if(isLoading || loading){
    return <FullPageLoader className="h-full w-full" />
  }
  return (
    <div className="h-screen bg-gray-900 text-white w-full px-8 py-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 h-16">
          <h1 className="text-3xl font-bold">User Profile</h1>
          {(isEditing.bio || isEditing.title || isEditing.username) && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 h-48">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="relative mb-6 md:mb-0 md:mr-8">
              {userProfile?.profilePicture ? (
                <Image
                  src={userProfile.profilePicture}
                  alt="user profile picture"
                  width={144}
                  height={144}
                  className="rounded-full"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gray-700 flex justify-center items-center text-4xl font-bold">
                  {userProfile?.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {(
              <UserInfo
                isEditing={isEditing}
                userInfo={userProfile}
                handleNameEdit={handleNameEdit}
                handleTitleEdit={handleTitleEdit}
                handleNameChange={handleNameChange}
                handleTitleChange={handleTitleChange}
              />
            )}
          </div>
        </div>

        {/* USER BIO START */}
        { (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 min-h-32 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Bio</h3>
              {!isEditing.bio && (
                <button
                  onClick={handleBioEdit}
                  className="text-gray-200 hover:text-gray-400 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            <textarea
              className={
                "w-full h-full bg-gray-800 text-white rounded-lg p-3 outline-none border-2 border-transparent focus:border-green-600  origin-top absolute top-0 left-0 " +
                (isEditing.bio
                  ? "scale-y-100 transition-transform duration-200"
                  : "scale-y-0")
              }
              rows={4}
              value={userProfile?.bio || ""}
              onChange={handleBioChange}
              placeholder="Tell us about yourself..."
            />
            <p className="text-gray-300">
              {displayOrDefault(
                userProfile?.bio,
                "This user hasn't added a bio yet. Click 'Edit' to add your bio!"
              )}
            </p>
          </div>
        )}

        {/* USER BIO START */}

        <UserStats userStats={{
          totalChats: userProfile?.totalChats,
          totalFriends: userProfile?.totalFriends,
          totalMessage: userProfile?.totalMessageSent
        }} />
        <RecentActivity />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Invite Friends
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
