import { BanIcon, BlocksIcon, LockIcon, UnlockIcon, UserMinusIcon } from "lucide-react";

type BlockedChatUIProps = {
  blockedUserId?: string;    
  currentUserId: string;     
  removedAt?: Date;         
  onUnblock?: () => void;  
};

const BlockedChatUI = ({ 
  blockedUserId,
  currentUserId,
  removedAt,
  onUnblock 
}: BlockedChatUIProps) => {
  // Determine the type of blocked state
  const getBlockedState = () => {
    if (removedAt) {
      return {
        type: 'removed_from_group',
        icon: <UserMinusIcon className="w-4 h-4 text-purple-400" />,
        bgColor: 'bg-purple-500/10',
        title: 'No Longer a Member',
        message: "You can't send messages as you're no longer in this group",
        showUnblock: false
      };
    }

    if (!blockedUserId) {
      return null;
    }

    const isCurrentUserBlocked = blockedUserId === currentUserId;

    return isCurrentUserBlocked 
      ? {
          type: 'blocked_by',
          icon: <LockIcon className="w-4 h-4 text-red-400" />,
          bgColor: 'bg-red-500/10',
          title: 'Messages Blocked',
          message: "You've been blocked from sending messages",
          showUnblock: false
        }
      : {
          type: 'blocked',
          icon: <BanIcon className="w-4 h-4 text-orange-400" />,
          bgColor: 'bg-orange-500/10',
          title: 'User Blocked',
          message: "Unblock user to send messages",
          showUnblock: true
        };
  };

  const state = getBlockedState();

  // If no blocked state, don't render anything
  if (!state) return null;

  return (
    <div className="h-16 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800/50 px-6 flex items-center backdrop-blur-sm">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${state.bgColor} 
            shadow-lg shadow-black/10 ring-1 ring-white/5`}>
            {state.icon}
          </div>
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-medium text-gray-200 tracking-tight">
              {state.title}
            </span>
            <span className="text-xs text-gray-400">
              {state.message}
            </span>
          </div>
        </div>
        
        {state.showUnblock && (
          <button 
            onClick={onUnblock}
            className="px-4 py-2 text-xs font-medium text-gray-200 
              bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700
              hover:from-gray-600 hover:via-gray-500 hover:to-gray-600
              active:from-gray-700 active:via-gray-600 active:to-gray-700
              transition-all duration-200 rounded-lg flex items-center space-x-2
              shadow-lg shadow-black/20 ring-1 ring-white/10
              hover:ring-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            <UnlockIcon className="w-3.5 h-3.5" />
            <span>Unblock User</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BlockedChatUI;