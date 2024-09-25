'use client'

import React, { useState } from 'react';
import { LogOut, Camera, Edit, Mail, UserPlus, Briefcase, Calendar, Bell, Settings, Shield } from "lucide-react";
import RecentActivity from './recentactivity';
import UserInfo from './userInfo';

export default function PrivateProfile() {

  const [isEditing, setIsEditing] = useState("")
  
  const [bio, setBio] = useState("");

  // Helper function to display default text or user input
  const displayOrDefault = (value: string, defaultText: string) => value || defaultText;

  return (
    <div className="h-screen bg-gray-900 text-white w-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Avatar */}
            <div className="relative mb-6 md:mb-0 md:mr-8">
              <div className="w-36 h-36 rounded-full bg-gray-700 flex justify-center items-center text-4xl font-bold">
                {/* Use initials or a default icon */}
                JD
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2">
                <Camera className="w-5 h-5" />
              </button>
            </div> 

            {/* User Info */}
            <UserInfo isEditing={isEditing} setIsEditing={setIsEditing} />
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Bio</h3>
            <button onClick={() => setIsEditing("bio")} className="text-gray-200 hover:text-gray-400 flex items-center">
              <Edit className="w-4 h-4 mr-1" />
              {isEditing === "bio" ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {isEditing === "bio" ? (
            <>
              <textarea
                className="w-full bg-gray-700 text-white rounded-lg p-2 2.5"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
              />
              <button onClick={() => setIsEditing("")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Save Changes
              </button>
            </>
          ) : (
            <p className="text-gray-300">
              {displayOrDefault(bio, "This user hasn't added a bio yet. Click 'Edit' to add your bio!")}
            </p>
          )}
        </div>

        <RecentActivity />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Invite Friends
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy Settings
          </button>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
