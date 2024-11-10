"use client";

import { LogOut, HelpCircle, Menu } from "lucide-react";
import SideBarNav from "./sidebarnav";
import Link from "next/link";
import { ecnf } from "@/utils/env";
import { useAuth } from "../shared/contexts/auth/authcontext";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ChatSidebar() {
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLElement | null>(null);
  const pathName = usePathname()

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        sidebarRef.current.classList.add("max-lg:-translate-x-full");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${ecnf.apiUrl}/auth/logout`, {
        credentials: "include",
      });

      if (res.ok) {
        sessionStorage.clear();
        window.location.href = ecnf.frontendUrl || "";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {<button
        onClick={() => {
          sidebarRef.current?.classList.toggle("max-lg:-translate-x-full");
        }}
        className={`p-2 ${pathName.startsWith("/chats/") && "max-lg2:hidden"} rounded-lg z-10 fixed top-4 left-4 lg:hidden bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 text-gray-100 transition-all duration-200`}
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="min-w-[65px]  border-r border-gray-700/40 h-screen bg-[#1e242c]
         text-white flex flex-col items-center overflow-y-auto overflow-x-hidden py-6 transition-all 
         duration-300 ease-in-out fixed lg:relative max-lg:w-[250px] max-lg:-translate-x-full max-lg:z-40"
      >
        {/* Profile Section */}
        <Link href="/profile" className="mb-4 group relative gap-2 flex flex-col items-center">
          <div className="w-10 h-10 max-lg:w-12 max-lg:h-12 rounded-full bg-gray-700 flex justify-center items-center text-xl font-bold text-gray-300 overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-gray-500">
            {user && user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.username}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              user?.username.charAt(0)
            )}
          </div>
          <span className="lg:hidden capitalize">
            {user?.username}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 w-full px-2 border-t border-gray-700 pt-4 flex flex-col items-center">
          <SideBarNav />

          <div className="pt-4 flex flex-col gap-2 border-t border-gray-700 mt-4">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 p-3 rounded-xl transition-all duration-200 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white group"
            >
              <span className="lg:hidden">Log Out</span>
              <LogOut className="text-inherit" size={20} />
            </button>

            {/* Help Button */}
            <button className="flex justify-center items-center gap-3 p-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-gray-700 hover:text-white group">
              <span className="lg:hidden">Help & Support</span>
              <HelpCircle className="text-inherit" size={20} />
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
