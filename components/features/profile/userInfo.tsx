"use client";

import { Edit, Mail, Calendar } from "lucide-react";
import { IUserProfile, IIsEditing } from "@/types/userTypes";

export default function UserInfo({
  handleNameChange,
  handleNameEdit,
  isEditing,
  userInfo,
}: {
  handleNameEdit: Function;
  userInfo: Omit<IUserProfile, "isCurrentUserSender" | "status">;
  handleNameChange: React.ChangeEventHandler<HTMLInputElement>;
  isEditing: IIsEditing;
}) {
  return (
    <div className={"w-full flex flex-col text-base sm:text-lg "+(isEditing.username?"gap-5":"gap-2")}>
      <div className="relative h-fit">
        <div
          className={`
          transform transition-all duration-300 origin-top absolute z-50
          ${
            isEditing.username
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }
        `}
        >
          <input
            type="text"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 
                     border-2 border-gray-700 focus:border-blue-500 outline-none
                     text-xl font-bold transition-colors"
            value={userInfo.username || ""}
            onChange={handleNameChange}
            placeholder="Enter username"
          />
        </div>

        {/* Display Username */}
        <div
          className={`
          flex items-center transition-opacity duration-300
          ${isEditing.username ? "opacity-0" : "opacity-100"}
        `}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {userInfo.username}
          </h2>
          <button
            onClick={() => handleNameEdit()}
            className="ml-3 p-1.5 rounded-full text-gray-400
                     hover:bg-gray-700 hover:text-white transition-all duration-200"
            aria-label="Edit username"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-1">
        {/* Email */}
        <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50">
            <Mail className="w-4 h-4" />
          </div>
          <span className="font-medium">{userInfo.email}</span>
        </div>

        {/* Join Date */}
        <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="font-medium">Joined {userInfo.createdAt}</span>
        </div>
      </div>
    </div>
  );
}
