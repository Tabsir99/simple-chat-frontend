import Image from "next/image";
import React from "react";

const TypingIndicator = ({ profilePicture, username }: { profilePicture: string, username: string }) => {
  return (
    <>
      {" "}
      <style>{`
     @keyframes typingAnimation {
       0% { transform: translateY(0px); }
       28% { transform: translateY(-5px); }
       44% { transform: translateY(0px); }
     }
     
     .animate-typing-dot {
       animation: typingAnimation 1.2s infinite ease-in-out;
     }
     `}</style>{" "}
      <div className="flex items-center w-fit space-x-2 p-4 bg-gray-700 bg-opacity-10 rounded-lg shadow-lg">
        {profilePicture?<Image src={profilePicture} alt="whatever" />:<span className="flex justify-center items-center uppercase border border-gray-600 p-1 text-[12px] rounded-full w-10 h-10 bg-gray-800"> {username.slice(0,2).trim()} </span>}
        <div className="text-gray-400">Typing</div>

        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-blue-300 rounded-full animate-typing-dot"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

// CSS for the animation

export default TypingIndicator;
