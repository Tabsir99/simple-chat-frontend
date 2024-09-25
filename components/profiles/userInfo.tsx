"use client";

import {
  LogOut,
  Camera,
  Edit,
  Mail,
  UserPlus,
  Briefcase,
  Calendar,
  Bell,
  Settings,
  Shield,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function UserInfo({
  isEditing,
  setIsEditing,
}: {
  isEditing: string;
  setIsEditing: Dispatch<SetStateAction<string>>;
}) {
  const [jobTitle, setJobTitle] = useState("");
  const [name, setName] = useState("John Doe");
  return (
    <>
      <div className="flex-grow flex flex-col text-[17px] justify-center items-center md:items-start">
        {isEditing === "name" ? (
          <div className="mb-6">
            <input
              type="text"
              className="w-full bg-gray-700 text-white rounded-lg p-2 mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={() => setIsEditing("")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Save Name
            </button>
          </div>
        ) : (
          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold">{name}</h2>
            <button
              onClick={() => setIsEditing("name")}
              className="text-gray-200 hover:text-gray-400 flex items-center ml-4"
            >
              <Edit className="w-4 h-4 mr-1" />
            </button>
          </div>
        )}

        <div className="flex items-center mb-2.5">
          <Mail className="w-5 h-5 mr-2 text-gray-400" />
          <span>john.doe@example.com</span>
        </div>

        <div className="flex items-center mb-2.5">
          {isEditing === "title" ? (
            <div>
              <input
                type="text"
                className="w-full bg-gray-700 text-white rounded-lg p-2 mb-2"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter your job title"
              />
              <button
                onClick={() => setIsEditing("")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Save Job Title
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
              <span>{jobTitle || "Add your job title"}</span>
              <button
                onClick={() => setIsEditing("title")}
                className="text-gray-200 hover:text-gray-400 flex items-center ml-4"
              >
                <Edit className="w-4 h-4 mr-1" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-400" />
          <span>
            Joined{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </>
  );
}
