import {
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  X,
  Shield,
  UserPlus2,
} from "lucide-react";
import { CustomButton } from "../ui/buttons";
import useFriendshipActions from "../hooks/useFriendshipActions";
import { FriendshipStatus, IUserProfile } from "@/types/userTypes";
import { KeyedMutator } from "swr";
import { ApiResponse } from "@/types/responseType";
import ConfirmationModal from "../ui/confirmationModal";
import { useState } from "react";

interface AddFriendBtnProps {
  user: {
    userId: string | null,
    username: string
  };
  status: FriendshipStatus;
  isCurrentUserSender: boolean;
  updateSender: (value: boolean) => void;
  isCurrentUserBlocked: boolean | undefined;
  mutate: KeyedMutator<
    ApiResponse<{
      userInfo: IUserProfile;
      isOwnProfile: boolean;
    }>
  >;
}

export default function AddFriendBtn({
  user,
  status,
  isCurrentUserSender,
  updateSender,
  isCurrentUserBlocked,
  mutate,
}: AddFriendBtnProps) {
  const { handleFriendshipAction } = useFriendshipActions({
    initFriendshipStatus: status,
    mutate: mutate,
  });

  const [showBlockModal, setShowBlockModal] = useState(false)

  if (status === "pending" && isCurrentUserSender) {
    return (
      <CustomButton
        onClick={() => handleFriendshipAction("cancel", user.userId as string)}
        variant="outline"
      >
        <X className="w-4 h-4 mr-2" />
        Cancel Request
      </CustomButton>
    );
  }

  if (status === "pending" && !isCurrentUserSender) {
    return (
      <div className="flex gap-2">
        <CustomButton
          onClick={() => handleFriendshipAction("accept", user.userId as string)}
          variant="success"
        >
          <UserCheck className="w-4 h-4 mr-2" />
          Accept
        </CustomButton>
        <CustomButton
          onClick={() => handleFriendshipAction("reject", user.userId as string)}
          variant="danger"
        >
          <UserX className="w-4 h-4 mr-2" />
          Reject
        </CustomButton>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className="flex gap-2">
        <CustomButton variant="outline" className="pointer-events-none">
          Friends
        </CustomButton>
        <CustomButton
          onClick={() => setShowBlockModal(true)}
          variant="danger"
        >
          <Shield className="w-4 h-4 mr-2" />
          Block
        </CustomButton>

        <ConfirmationModal
          isOpen={showBlockModal}
          onClose={() => setShowBlockModal(false)}
          title={`Block ${user.username}?`}
          onConfirm={() => handleFriendshipAction("block", user.userId as string)}
        >
          This will remove them from your friends list and block all future
          interactions.
        </ConfirmationModal>
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <>
        {!isCurrentUserBlocked && (
          <CustomButton
            onClick={() => handleFriendshipAction("unblock", user.userId as string)}
            variant="default"
          >
            <Shield className="w-4 h-4 mr-2" />
            Unblock
          </CustomButton>
        )}
      </>
    );
  }

  return (
    <CustomButton
      onClick={() => {
        handleFriendshipAction("create", user.userId as string);
        updateSender(true);
      }}
      variant="success"
    >
      <UserPlus2 className="w-4 h-4 mr-2" />
      Add Friend
    </CustomButton>
  );
}
