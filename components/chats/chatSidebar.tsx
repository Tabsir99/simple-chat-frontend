import {
  Settings,
  Search,
  LogOut,
  HelpCircle,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function ChatSidebar() {
  return (
    <aside className="w-16 h-screen bg-[#222a30] text-white flex flex-col items-center overflow-y-auto overflow-x-hidden p-4">
      {/* Profile Section */}
      <div className="mb-4 w-8 h-8 rounded-full border cursor-pointer"></div>
      {/* Menu List */}
      <nav className="flex-1 border-t border-gray-700 pt-2">
        <ul className="space-y-2 flex flex-col items-center">
          <li className="flex items-center justify-center w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Link href="/chats/favorites" className="p-3 block">
              <Heart
                className="text-white"
                size={20}
                aria-label="Favorite"
              />
            </Link>
          </li>
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Search
              className="text-white"
              size={20}
              aria-label="Search People"
            />
          </li>
        </ul>
        {/* Divider */}
        <hr className="my-4 border-gray-700" />
        <ul className="space-y-2 flex flex-col items-center">
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Settings
              className="text-white"
              size={20}
              aria-label="Settings"
            />
          </li>
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <LogOut
              className="text-white"
              size={20}
              aria-label="Log Out"
            />
          </li>
        </ul>
        {/* Divider */}
        <hr className="my-4 border-gray-700" />
        {/* Help & Feedback */}
        <div className="mt-4 p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer flex items-center justify-center">
          <HelpCircle
            className="text-white"
            size={20}
            aria-label="Help"
          />
        </div>
      </nav>
    </aside>
  );
}