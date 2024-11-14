import { useState, useEffect } from "react";
import { IIsEditing, IUserProfile } from "@/types/userTypes";
import useCustomSWR from "../common/customSwr";
import { ecnf } from "@/utils/constants/env";

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

export const useProfileManagement = () => {
  const [userProfile, setUserProfile] = 
    useState<Omit<IUserProfile, "isCurrentUserSender" | "status">>(defaultProfile);
  const [isEditing, setIsEditing] = useState<IIsEditing>({
    bio: false,
    username: false,
  });
  const [isSaving, setIsSaving] = useState(false);

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

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserProfile((prev) => ({ ...prev, bio: e.target.value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile((prev) => ({ ...prev, username: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Implement your save logic here
      // await updateUserProfile(userProfile);
      setIsEditing({
        bio: false,
        username: false,
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Handle error appropriately
    } finally {
      setIsSaving(false);
    }
  };

  return {
    userProfile,
    isEditing,
    isSaving,
    isLoading,
    handleBioEdit,
    handleNameEdit,
    handleBioChange,
    handleNameChange,
    handleSave,
  };
};