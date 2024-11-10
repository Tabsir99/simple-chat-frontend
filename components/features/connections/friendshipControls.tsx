import {
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  X,
  Shield,
  UserPlus2,
} from "lucide-react";
import { CustomButton } from "../../shared/ui/atoms/Button/customButton";
import useFriendshipActions from "../../shared/hooks/userProfile/useFriendshipActions";
import ConfirmationModal from "../../shared/ui/organisms/modal/confirmationModal";
import { useEffect, useState } from "react";
import { Friends } from "@/types/userTypes";

interface FriendShipControlsProps {
  user: {
    userId: string | null,
    username: string
  };
  status: Friends["status"];
  isCurrentUserSender: boolean;
  updateSender: (value: boolean) => void;
  isCurrentUserBlocked: boolean | undefined;

}

export default function FriendShipControls({
  user,
  status,
  isCurrentUserSender,
  updateSender,
  isCurrentUserBlocked,
}: FriendShipControlsProps) {
  const { handleFriendshipAction } = useFriendshipActions();

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
