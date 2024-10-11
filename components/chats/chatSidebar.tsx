'use client'

import { LogOut, HelpCircle } from "lucide-react";

import SideBarNav from "./sidebarnav";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChatSidebar() {
  const router = useRouter()

  return (
    <aside className="w-16 h-screen bg-[#222a30] text-white flex flex-col items-center overflow-y-auto overflow-x-hidden p-4">
      {/* Profile Section */}
      <Link href="/profile" className="mb-4 w-10 h-10 rounded-full bg-gray-700 text-base font-bold flex justify-center items-center text-gray-300 cursor-pointer">
          JD
      </Link>
      {/* Menu List */}
      <nav className="flex-1 border-t border-gray-700 pt-2">
        <SideBarNav />
        {/* Divider */}
        <hr className="my-4 border-gray-700" />
        <div className="space-y-2 flex flex-col self-end items-center">
          <button onClick={async () => {
            const res = await fetch("http://localhost:3001/api/auth/logout",{
              credentials: "include"
            })
            if(res.ok){ 
              sessionStorage.clear()
              window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL || ""
            }
          }} className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <LogOut className="text-white" size={20} aria-label="Log Out" />
          </button>
        </div>
        {/* Divider */}
        <hr className="my-4 border-gray-700" />
        {/* Help & Feedback */}
        <div className="mt-4 p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer flex items-center justify-center">
          <HelpCircle className="text-white" size={20} aria-label="Help" />
        </div>
      </nav>
    </aside>
  );
}
