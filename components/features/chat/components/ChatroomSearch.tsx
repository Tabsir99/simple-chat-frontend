import { Search } from "lucide-react";

export default function ChatroomSearch() {
  return (
    <>
      <button
        className="relative -ml-3 group flex items-center justify-center p-3 rounded-full transition-all 
          duration-300 hover:bg-gray-700 xs:border-gray-700 xs:border
          xl:hidden max-sm:hidden
          "
        onClick={() => {}}
      >
        <Search className="w-4 h-4" />
      </button>

      <div className="px-2 bg-[#292f36] rounded-md text-[16px] flex justify-center items-center max-xl:hidden">
        <input
          type="search"
          className="p-2 bg-transparent outline-none"
          placeholder="Search chat..."
        />
        <button
          className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
          onClick={() => {}}
        >
          <Search size={24} />
        </button>
      </div>
    </>
  );
}
