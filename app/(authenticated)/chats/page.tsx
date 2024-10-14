"use client";

import React, { useEffect } from "react";
import { MessageSquare } from "lucide-react";

export default function AllChatsPlaceholder() {
  useEffect(() => {
    const channel = new BroadcastChannel("c1");
    channel.postMessage("success");
    return () => channel.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900/70 text-gray-300">
      <MessageSquare size={64} className="text-blue-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Welcome to Your Chats</h1>
      <p className="text-xl mb-8">Select a conversation to get started</p>
      <div className="w-64 h-1 bg-blue-500 rounded-full mb-8"></div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="w-16 h-3 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}