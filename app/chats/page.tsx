"use client";
import { useEffect } from "react";
import { BsChatFill } from "react-icons/bs";

export default function AllChats() {
  useEffect(() => {
    const channel = new BroadcastChannel("c1");
    channel.postMessage("success")

    const res = fetch("http://localhost:3001/api/auth/refresh",{
      credentials: "include"
    })
    return () => channel.close()
  }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center text-6xl gap-2 h-full text-gray-400">
        <BsChatFill />
        <h2 className="text-2xl font-bold mb-2">Welcome to the Chat App</h2>
        <p className="text-center text-base max-w-md">
          Select a chat from the sidebar to start messaging or create a new
          conversation.
        </p>
      </div>
    </>
  );
}
