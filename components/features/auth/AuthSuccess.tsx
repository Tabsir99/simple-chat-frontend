import React, { useEffect, useState } from "react";

const AuthSuccess = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel("c1");

    const handleMessage = () => {
      setShow(true);
    };

    channel.addEventListener("message", handleMessage);
    return () => channel.close();
  }, []);

  return (
    <div className={`min-h-[100dvh] w-screen fixed bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 transform transition-all duration-700 ease-out ${
          show
            ? "translate-y-0 opacity-100 scale-100 z-50"
            : "-translate-y-8 opacity-0 scale-95 pointer-events-none"
        }`}>
            
        <div className="border-0 bg-gray-800/50 backdrop-blur-lg shadow-2xl flex flex-col items-center text-center p-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
            Authentication Successful!
          </div>
          <div className="text-gray-300">
            <div className="space-y-4">
              <p className="text-lg">
                You've been successfully authenticated.
              </p>
              <p className="text-sm text-gray-400">
                You can safely close this tab and return to the original
                window.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AuthSuccess;
