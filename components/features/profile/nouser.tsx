"use client";

import { Ban } from "lucide-react";

const NoUserFound = () => {
  return (
    <div className="h-[100dvh] bg-gray-900 text-gray-100 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Icon */}
          <div className="mb-6">
            <Ban className="w-24 h-24 text-red-500 mx-auto" />
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
          <p className="text-gray-400 mb-8 text-balance text-center">
            We couldn&apos;t find the user you&apos;re looking for. They might have been
            deleted or never existed.
          </p>

          
        </div>
      </div>
    </div>
  );
};

export default NoUserFound;
