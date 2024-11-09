import React from 'react';
import { Search, UserPlus, Users } from 'lucide-react';

export default function SearchPeoplePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900/70 text-gray-300 p-8 max-md:hidden">
      <div className="mb-8 relative">
        <Search size={64} className="relative z-10" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Find Your Connections</h2>
      <p className="text-center mb-8 max-w-md">
        Search for people, discover new connections, and expand your network. 
        Click on a profile to view more details.
      </p>
      <div className="flex space-x-8">
        <div className="flex flex-col items-center">
          <div className="bg-gray-800 p-4 rounded-full mb-2">
            <UserPlus size={32} />
          </div>
          <span className="text-sm">Add Friends</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-800 p-4 rounded-full mb-2">
            <Users size={32} />
          </div>
          <span className="text-sm">View Connections</span>
        </div>
      </div>
    </div>
  );
}