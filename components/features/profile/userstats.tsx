import { MessageCircle, MessageSquareIcon, UsersIcon } from "lucide-react";

export default function UserStats({
  userStats,
}: {
  userStats: { totalMessage: number; totalChats: number; totalFriends: number };
}) {
  return (
    <>
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<MessageCircle />}
          label="Total Chats"
          value={userStats.totalChats}
        />
        <StatCard
          icon={<UsersIcon />}
          label="Total Friends"
          value={userStats.totalFriends || 0}
        />
        <StatCard
          icon={<MessageSquareIcon />}
          label="Total Message"
          value={userStats.totalMessage}
        />
      </div>
    </>
  );
}

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="bg-gray-800 rounded-xl p-4 shadow-lg backdrop-blur-lg bg-opacity-50">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);
