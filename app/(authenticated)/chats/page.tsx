"use client";

import React, { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { GrGroup } from "react-icons/gr";

export default function AllChatsPlaceholder() {
  useEffect(() => {
    const channel = new BroadcastChannel("c1");
    channel.postMessage("success");
    return () => channel.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-gray-900/70 text-gray-300 max-md:hidden">
      <MessageSquare size={64} className="text-blue-500 mb-6" />
      <h1 className="text-3xl max-lg:text-xl font-bold mb-2">
        Welcome to Your Chats
      </h1>
      <p className="text-xl max-lg:text-base mb-8">
        Select a conversation to get started
      </p>
      <div className="w-64 h-1 bg-blue-500 rounded-full mb-8"></div>
      <div className="grid grid-cols-3 gap-4 max-lg:gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-24 h-24 max-lg:w-20 max-lg:h-20 bg-gray-800 rounded-lg flex items-center justify-center"
          >
            <div className="w-16 h-3 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
