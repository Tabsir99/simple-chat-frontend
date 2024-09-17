import React from "react";
import {
  AccountCircle,
  Chat,
  PersonAdd,
  Report,
  Block,
  Group,
  VisibilityOff,
} from "@mui/icons-material";
import Send from "@mui/icons-material/Send";

const UserPublicProfile = () => {
  return (
    <div className="h-screen bg-gray-900 text-gray-100 p-8 overflow-y-scroll">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Profile</h1>

          <button className=" bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center">
            <Block className="w-5 h-5 mr-1" />
            Block
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            {/* Avatar */}
            <div className="relative mb-6 md:mb-0 md:mr-8">
              <div className="w-36 h-36 rounded-full bg-gray-700 flex justify-center items-center text-4xl font-bold">
                JD
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">John Doe</h2>
              <p className="text-gray-400 mb-4">@johndoe</p>
              <div className="flex justify-center md:justify-start items-center mb-4">
                <AccountCircle className="w-5 h-5 mr-2 text-gray-400" />
                <span>john.doe@example.com</span>
              </div>

              {/* Inline Quick Actions */}
              <div className="flex justify-center md:justify-start space-x-4">
                <button className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <PersonAdd className="w-5 h-5 mr-2" />
                  Add Friend
                </button>
                <button className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Bio</h3>
          <p className="text-gray-300 mb-4">
            Hi there! I'm John, a software developer passionate about creating
            user-friendly applications. When I'm not coding, you can find me
            hiking in the mountains or trying out new coffee shops.
          </p>

          {/* Anonymous Chat */}
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Total Chats</h4>
            <p className="text-3xl font-bold text-blue-400">1,234</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Friends</h4>
            <p className="text-3xl font-bold text-green-400">567</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Groups</h4>
            <p className="text-3xl font-bold text-purple-400">42</p>
          </div>
        </div>

        {/* Add to Group Button */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 gap-10 flex justify-stretch items-center">
          <button className="bg-gray-900 w-full hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center">
            <Group className="w-5 h-5 mr-2" />
            Add to Group
          </button>
          <button className="bg-gray-900 w-full justify-center hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center">
            <VisibilityOff className="w-5 h-5 mr-2" />
            Start Anonymous Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPublicProfile;
