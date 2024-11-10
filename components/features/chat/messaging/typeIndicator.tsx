import React from "react";
import Image from "next/image";

const TypingIndicator = ({ typingUsers }: { typingUsers: { profilePicture: string; username: string }[] }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg">
      <div className="flex -space-x-3 overflow-hidden">
        {typingUsers.slice(0, 3).map((user, index) => (
          <div key={index} className="inline-block rounded-full border-2 border-gray-600">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.username}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex justify-center items-center uppercase text-white bg-gray-700 rounded-full w-8 h-8 text-xs font-semibold">
                {user.username.charAt(0)}
              </span>
            )}
          </div>
        ))}
        {typingUsers.length > 3 && (
          <span className="flex justify-center items-center text-xs font-semibold text-white bg-blue-600 rounded-full w-8 h-8">
            +{typingUsers.length - 3}
          </span>
        )}
      </div>
      <div className="text-gray-300 text-sm font-medium">
        {typingUsers.length === 1
          ? `${typingUsers[0].username} is typing`
          : `${typingUsers.length} people are typing`}
      </div>
      <div className="flex gap-1 translate-y-0.5">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-typing-dot"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>
    </div>
  );
};

export default TypingIndicator;