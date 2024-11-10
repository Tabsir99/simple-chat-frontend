import { ShieldOff } from "lucide-react";

const BlockMessage = () => (
  <div className="h-screen bg-gradient-to-br overflow-y-auto from-gray-900 to-gray-800 flex justify-center items-center p-4">
    <div className="max-w-md w-full mx-auto p-8 rounded-xl bg-gray-800 shadow-xl backdrop-blur-lg bg-opacity-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <ShieldOff size={48} className="text-red-500" />
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
        </div>
        <h2 className="text-2xl font-bold text-center text-white">
          Access Restricted
        </h2>
        <p className="text-gray-300 text-center">
          You've been blocked by this user. Unable to view their profile or
          interact at this time.
        </p>
      </div>
    </div>
  </div>
);

export default BlockMessage;
