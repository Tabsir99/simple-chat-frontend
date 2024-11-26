import { useState, useEffect } from "react";
import { IIsEditing, IUserProfile } from "@/types/userTypes";
import useCustomSWR from "../common/customSwr";
import { ecnf } from "@/utils/constants/env";
import { useAuth } from "../../contexts/auth/authcontext";
import { ApiResponse } from "@/types/responseType";

const defaultProfile: Omit<IUserProfile, "isCurrentUserSender" | "status"> = {
  email: "",
  createdAt: "",
  username: "",
  bio: "",
  profilePicture: "",
  totalChats: 0,
  totalFriends: 0,
  totalMessageSent: 0,
};

export const useProfileManagement = () => {
  const [userProfile, setUserProfile] =
    useState<Omit<IUserProfile, "isCurrentUserSender" | "status">>(
      defaultProfile
    );
  const [isEditing, setIsEditing] = useState<IIsEditing>({
    bio: false,
    username: false,
    image: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [userImage, setUserImage] = useState<File | null>(null);
  const { checkAndRefreshToken } = useAuth();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      const url = URL.createObjectURL(image);
      setUserProfile((prev) => ({ ...prev, profilePicture: url }));
      setUserImage(image);
      setIsEditing((prev) => ({ ...prev, image: true }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile((prev) => ({ ...prev, username: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await checkAndRefreshToken();
      const res = await fetch(`${ecnf.apiUrl}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userProfile.username,
          bio: userProfile.bio,
          image: userImage && {
            imageName: userImage.name,
            imageSize: userImage.size,
            imageType: userImage.type,
          },
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as ApiResponse<string>;
        await fetch(data.data as string, {
          method: "PUT",
          body: userImage,
        });

        await fetch(`${ecnf.apiUrl}/users/me/avatar`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          method: "PUT",
          body: JSON.stringify({
            fileName: userImage?.name,
          }),
        });
      }
      setIsEditing({
        bio: false,
        username: false,
        image: false,
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
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
    handleImageChange,
  };
};
