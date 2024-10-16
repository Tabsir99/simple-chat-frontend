'use client'

import { LogOut, HelpCircle } from "lucide-react";

import SideBarNav from "./sidebarnav";
import Link from "next/link";
import { useSocket } from "../contextProvider/websocketContext";
import { ecnf } from "@/utils/env";

export default function ChatSidebar() {

  const {socket, isConnected}  = useSocket()

  return (
    <aside className="w-16 h-screen bg-[#1e242c] border-r-2 border-gray-700/40 text-white flex flex-col items-center overflow-y-auto overflow-x-hidden p-4">
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
            const res = await fetch(`${ecnf.apiUrl}/auth/logout`,{
              credentials: "include"
            })
            if(res.ok){ 
              sessionStorage.clear()
              window.location.href = ecnf.frontendUrl || ""
            }
          }} className="flex items-center justify-center p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer">
            <LogOut className="text-white" size={20} aria-label="Log Out" />
          </button>
        </div>
        {/* Divider */}
        <hr className="my-4 border-gray-700" />
        {/* Help & Feedback */}
        <div onClick={() => {
          if(!isConnected) return
          socket?.send("Test message")
          socket?.on("message",(e) => console.log(e))
        }} className="mt-4 p-3 w-fit hover:bg-gray-700 rounded-lg cursor-pointer flex items-center justify-center">
          <HelpCircle className="text-white" size={20} aria-label="Help" />
        </div>
      </nav>
    </aside>
  );
}
