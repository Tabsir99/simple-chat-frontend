import MainLayout from "@/app/chats/layout";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import UserPublicProfile from "@/components/profiles/publicprfoile";

export default function UserProfile() {
  const personal = true;
  return (
    <MainLayout>
      {!personal ? (
        <UserPublicProfile />
      ) : (
        <div className="h-screen bg-gray-900 text-white p-8 overflow-y-scroll">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">User Profile</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row">
                {/* Avatar */}
                <div className="relative mb-6 md:mb-0 md:mr-8">
                  <div className="w-36 h-36 rounded-full bg-gray-700 flex justify-center items-center text-4xl font-bold">
                    {" "}
                    JD{" "}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2">
                    <CameraAltIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold mb-2">John Doe</h2>
                  <p className="text-gray-400 mb-4">@johndoe</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <EmailIcon className="w-5 h-5 mr-2 text-gray-400" />
                      <span>john.doe@example.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Bio</h3>
                <button className="text-blue-400 hover:text-blue-300 flex items-center">
                  <EditIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
              <p className="text-gray-300">
                Hi there! I'm John, a software developer passionate about
                creating user-friendly applications. When I'm not coding, you
                can find me hiking in the mountains or trying out new coffee
                shops.
              </p>
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center">
                <GroupAddIcon className="w-5 h-5 mr-2" />
                Invite Friends
              </button>
              <button className="bg-red-600 hover:bg-red-700 justify-center text-white px-4 py-2 rounded-lg flex items-center">
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
