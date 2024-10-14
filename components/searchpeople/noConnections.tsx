import { UserPlus, UserX, Users } from "lucide-react";

export const NoConnectionsMessage = ({
    type,
  }: {
    type: "friends" | "pending" | "blocked";
  }) => {
    const messages = {
      friends: {
        icon: <Users className="text-blue-400" size={48} />,
        title: "No Friends Yet",
        message: "Start connecting with people to build your network!",
        action: "Find Friends",
      },
      pending: {
        icon: <UserPlus className="text-green-400" size={48} />,
        title: "No Pending Requests",
        message: "You're all caught up! No friend requests waiting.",
        action: "Discover People",
      },
      blocked: {
        icon: <UserX className="text-red-400" size={48} />,
        title: "No Blocked Users",
        message: "Your block list is empty. Enjoy a positive experience!",
        action: "Go to chats",
      },
    };
  
    const content = messages[type];
  
    return (
      <div className="col-span-2 flex justify-center items-center">
        <div className="text-center p-8 bg-gray-800/50 rounded-xl w-full max-w-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <div className="mb-6 flex justify-center">{content.icon}</div>
          <h3 className="text-2xl font-bold text-gray-100 mb-3">
            {content.title}
          </h3>
          <p className="text-gray-300 mb-6">{content.message}</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-md font-semibold transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            {content.action}
          </button>
        </div>
      </div>
    );
  };
  