export default function RecentActivity() {
  return (
    <>
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Total Chats</h4>
          <p className="text-3xl font-bold text-gray-200">0</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Friends</h4>
          <p className="text-3xl font-bold text-green-400">0</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Groups</h4>
          <p className="text-3xl font-bold text-purple-400">0</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Posts</h4>
          <p className="text-3xl font-bold text-yellow-400">0</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-400">
          No recent activity. Start interacting to see your activity here!
        </p>
      </div>
    </>
  );
}
