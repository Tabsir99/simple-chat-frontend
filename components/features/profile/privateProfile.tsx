"use client";
import { LogOut, Camera,UserPlus, Save } from "lucide-react";
import UserInfo from "./userInfo";
import UserStats from "./userstats";
import Image from "next/image";
import FullPageLoader from "../../shared/ui/organisms/fullpageloader";
import UserBio from "./userBio";
import { useProfileManagement } from "../../shared/hooks/userProfile/useProfileEdit";

export default function PrivateProfile() {
  const {
    userProfile,
    isEditing,
    isLoading,
    isSaving,
    
    handleBioChange,
    handleBioEdit,
    handleNameChange,
    handleNameEdit,
    handleSave,
  } = useProfileManagement();

  if (isLoading) {
    return <FullPageLoader className="" width="100%" height="100%" />;
  }
  return (
    <div className="min-h-[100dvh] w-full bg-gray-900 text-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
        <UserBio
          bio={userProfile.bio}
          handleBioChange={handleBioChange}
          handleBioEdit={handleBioEdit}
          isEditingBio={isEditing.bio}
        />

        {/* Stats Section - Keep original component */}
        <UserStats
          userStats={{
            totalChats: userProfile?.totalChats,
            totalFriends: userProfile?.totalFriends,
            totalMessage: userProfile?.totalMessageSent,
          }}
        />

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
