'use client'

import { useState } from 'react';
import { 
  Chat, 
  Group, 
  Settings, 
  Search, 
  Logout, 
  Notifications, 
  HelpOutline, 
  Person2
} from '@mui/icons-material';

export default function ChatSidebar() {


  return (
    <aside className="w-16 h-screen bg-[#222a30] text-white flex flex-col items-center overflow-y-auto overflow-x-hidden p-4">
      {/* Profile Section */}
      <div className="mb-4 w-8 h-8 rounded-full border cursor-pointer">
        
      </div>

      {/* Menu List */}
      <nav className="flex-1 border-t border-gray-700 pt-2">
        <ul className="space-y-2 flex flex-col items-center">
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Chat className="text-white text-[1px]" fontSize='small' titleAccess='All Chats' />
          </li>
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Group className="text-white text-[1px]" fontSize='small' titleAccess='Groups' />
          </li>
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Notifications className="text-white text-[1px]" fontSize='small' titleAccess='Notifications' />
          </li>
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Search className="text-white text-[1px]" fontSize='small' titleAccess='Search People' />
          </li>
        </ul>

        {/* Divider */}
        <hr className="my-4 border-gray-700" />

        <ul className="space-y-2 flex flex-col items-center">
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Settings className="text-white text-[1px]" fontSize='small' titleAccess='Settings' />
          </li>
          <li className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <Logout className="text-white text-[1px]" fontSize='small' titleAccess='Log Out' />
          </li>
        </ul>

        {/* Divider */}
        <hr className="my-4 border-gray-700" />

       

        {/* Help & Feedback */}
        <div className="mt-4 p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer flex items-center justify-center">
          <HelpOutline className="text-white text-[1px]" fontSize='small' titleAccess='Help' />
        </div>
      </nav>
    </aside>
  );
}
