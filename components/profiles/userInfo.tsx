"use client";

import {
  Edit,
  Mail,
  Briefcase,
  Calendar,
} from "lucide-react";
import { IUserProfile,IIsEditing } from "@/types/userTypes";

export default function UserInfo({
handleNameChange,
handleNameEdit,
handleTitleChange,
handleTitleEdit,
isEditing,
  userInfo
}: {
  handleTitleEdit: Function
  handleNameEdit: Function
  userInfo: Omit<IUserProfile, 'isSender' | 'status'>
  handleNameChange: React.ChangeEventHandler<HTMLInputElement>
  handleTitleChange: React.ChangeEventHandler<HTMLInputElement>
  isEditing: IIsEditing

}) {
  
  return (
    <>
      <div className="flex-grow flex flex-col text-[17px] justify-center items-center md:items-start relative">
        
          <div className={"h-12 mb-2 text-2xl absolute top-0 left-0 origin-top w-fit "+(isEditing.username?"scale-y-100 transition-transform duration-300":"scale-y-0")}>
            <input
              type="text"
              className="w-full bg-gray-800 text-white rounded-lg px-2 py-1 h-full outline-none border-gray-600 border-2 focus:border-gray-400"
              value={userInfo.username || ""}
              onChange={handleNameChange}
            />
          </div>

          <div className="flex items-center h-12 mb-2">
            <h2 className="text-3xl font-bold">{userInfo.username}</h2>
            <button
              onClick={() => handleNameEdit()}
              className="text-gray-200 hover:text-gray-400 flex items-center ml-4"
            >
              <Edit className="w-4 h-4 mr-1" />
            </button>
          </div>


        <div className="flex items-center mb-2">
          <Mail className="w-5 h-5 mr-2 text-gray-400" />
          <span>{userInfo.email}</span>
        </div>

        <div className="flex items-center mb-3 relative">
          
            <div className={"h-8 origin-top absolute top-0 left-0 "+(isEditing.title?"scale-y-100 transition-transform duration-300":"scale-y-0")}>
              <input
                type="text"
                className="w-full bg-gray-800 text-white rounded-lg p-2 outline-none border-gray-600 focus:border-gray-400 border-2"
                value={userInfo.title || ""}
                onChange={handleTitleChange}
                placeholder="Enter your job title"
              />

            </div>
           
            <div className="flex items-center h-8">
              <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
              <span>{userInfo.title || "Add your job title"}</span>
              <button
                onClick={() => handleTitleEdit()}
                className="text-gray-200 hover:text-gray-400 flex items-center ml-4"
              >
                <Edit className="w-4 h-4 mr-1" />
              </button>
            </div>
          
        </div>

        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-400" />
          <span>
            Joined{" "}
            {`${userInfo.createdAt}`}
          </span>
        </div>
      </div>
    </>
  );
}
