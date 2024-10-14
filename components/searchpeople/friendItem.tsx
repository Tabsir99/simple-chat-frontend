import Link from "next/link";
import { CustomButton } from "../ui/buttons";
import ConfirmationModal from "../ui/confirmationModal";
import Image from "next/image";
import { Ban, Check, Shield, X } from "lucide-react";
import { useState } from "react";

interface FriendItemProps {
    username: string;
    status: "online" | "offline" | "pending" | "blocked";
    profilePicture: string;
    isSender: boolean;
    userId: string;
    onAccept: () => void;
    onReject: () => void;
    onBlock: () => void;
    onUnblock: () => void;
  }
  
export const FriendItem = ({
    username,
    status,
    profilePicture,
    isSender,
    userId,
    onAccept,
    onReject,
    onBlock,
    onUnblock,
  }: FriendItemProps) => {
    const [showBlockModal, setShowBlockModal] = useState(false);
  
    const getStatusStyles = (
      status: "online" | "offline" | "pending" | "blocked"
    ) => {
      const styles = {
        online: { dot: "bg-emerald-500", text: "text-emerald-400" },
        offline: { dot: "bg-slate-500", text: "text-slate-400" },
        pending: { dot: "bg-amber-500", text: "text-amber-400" },
        blocked: { dot: "bg-red-500", text: "text-red-400" },
      };
      return styles[status] || styles.offline;
    };
  
    const statusStyles = getStatusStyles(status);
  
    const renderActions = () => {
      switch (status.toLowerCase()) {
        case "pending":
          return (
            <div className="flex gap-2">
              {!isSender && (
                <CustomButton variant="success" size="sm" onClick={onAccept}>
                  <Check className="w-4 h-4" />
                </CustomButton>
              )}
              <CustomButton variant="danger" size="sm" onClick={onReject}>
                <X className="w-4 h-4" />
              </CustomButton>
            </div>
          );
        case "blocked":
          return (
            <CustomButton variant="outline" size="sm" onClick={onUnblock}>
              <Shield className="w-4 h-4 mr-1.5" />
              Unblock
            </CustomButton>
          );
        case "online":
        case "offline":
          return (
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => setShowBlockModal(true)}
              className="text-red-400 hover:text-red-300"
            >
              <Ban className="w-4 h-4 mr-1.5" />
              Block
            </CustomButton>
          );
        default:
          return null;
      }
    };
  
    return (
      <>
        <div className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-80 rounded-xl transition-all duration-200">
          <div className="relative">
            <Link
              href={`/search-people/${userId}`}
              className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden"
            >
              {profilePicture ? (
                <Image
                  className="w-full h-full object-cover"
                  src={profilePicture}
                  alt={username}
                  width={50}
                  height={50}
                />
              ) : (
                <span className="text-white text-lg font-medium">
                  {username.charAt(0)}
                </span>
              )}
            </Link>
            <div
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${statusStyles.dot}`}
            />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-white font-medium truncate">{username}</h3>
            <p className={`${statusStyles.text} text-sm font-medium`}>{status}</p>
          </div>
          <div className="flex items-center shrink-0">{renderActions()}</div>
        </div>
  
        <ConfirmationModal
          isOpen={showBlockModal}
          onClose={() => setShowBlockModal(false)}
          title={`Block ${username}?`}
          actions={
            <>
              <CustomButton
                variant="ghost"
                onClick={() => setShowBlockModal(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="danger"
                onClick={() => {
                  onBlock();
                  setShowBlockModal(false);
                }}
              >
                Block User
              </CustomButton>
            </>
          }
        >
          This will remove them from your friends list and block all future
          interactions.
        </ConfirmationModal>
      </>
    );
  };




