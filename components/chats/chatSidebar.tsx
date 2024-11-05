"use client";

import { LogOut, HelpCircle } from "lucide-react";

import SideBarNav from "./sidebarnav";
import Link from "next/link";
import { ecnf } from "@/utils/env";
import { useAuth } from "../authComps/authcontext";
import Image from "next/image";

export default function ChatSidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-16 h-screen bg-[#1e242c] border-r-2 border-gray-700/40 text-white flex flex-col items-center overflow-y-auto overflow-x-hidden p-4">
      {/* Profile Section */}
      <Link
        href="/profile"
        className="mb-4 uppercase w-10 h-10 rounded-full bg-gray-700 text-base font-bold flex justify-center items-center text-gray-300 cursor-pointer"
      >
        {user && user.profilePicture ? (
          <Image src={user.profilePicture} alt={user.username} />
        ) : (
          user?.username.charAt(0)
        )}
      </Link>
      {/* Menu List */}
      <nav className="flex-1 border-t border-gray-700 pt-2">
        <SideBarNav />
        {/* Divider */}
        <hr className="my-4 border-gray-700" />

        <button
          onClick={async () => {
            const res = await fetch(`${ecnf.apiUrl}/auth/logout`, {
              credentials: "include",
            });
            if (res.ok) {
              sessionStorage.clear();
              window.location.href = ecnf.frontendUrl || "";
            }
          }}
          className="flex items-center justify-center w-10 h-10 rounded-xl
            transition-all duration-300 ease-in-out
            bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="text-white" size={20} aria-label="Log Out" />
        </button>
        {/* Divider */}
        <hr className="my-4 border-gray-700" />
        {/* Help & Feedback */}
        <div
          
          className="mt-4 p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer flex items-center justify-center"
        >
          <HelpCircle className="text-gray-300" size={20} aria-label="Help" />
        </div>
      </nav>
    </aside>
  );
}
