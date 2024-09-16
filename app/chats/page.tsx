"use client";

import MessageOutlined from "@mui/icons-material/MessageOutlined";

export default function AllChats() {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-6xl gap-2 h-full text-gray-400">
        <MessageOutlined fontSize="inherit" />
        <h2 className="text-2xl font-bold mb-2">Welcome to the Chat App</h2>
        <p className="text-center text-base max-w-md">
          Select a chat from the sidebar to start messaging or create a new
          conversation.
        </p>
      </div>
    </>
  );
}
