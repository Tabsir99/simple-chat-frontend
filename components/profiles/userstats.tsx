export default function UserStats({ userStats }: { userStats: { totalMessage: number, totalChats: number, totalFriends: number } }) {
  return (
    <>
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Total Chats</h4>
          <p className="text-3xl font-bold text-gray-200">{userStats.totalChats}</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Friends</h4>
          <p className="text-3xl font-bold text-gray-200">{userStats.totalFriends}</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Total Messages</h4>
          <p className="text-3xl font-bold text-gray-200">{userStats.totalMessage}</p>
        </div>
      </div>

    </>
  );
}
