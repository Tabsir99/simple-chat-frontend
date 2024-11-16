import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { ecnf } from "@/utils/constants/env";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/responseType";
import QuerySpinner from "@/components/shared/ui/atoms/Spinner/QuerySpinner";
import { IMessage } from "@/types/chatTypes";
import useSearchMessage from "@/components/shared/hooks/chat/message/useSearchMessage";

interface ChatroomSearchProps {
  showSearch: boolean;
  toggleSearch: () => void;
  fetchedMessages: IMessage[];
}

const ChatroomSearch: React.FC<ChatroomSearchProps> = ({
  showSearch,
  toggleSearch,
  fetchedMessages,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [targetMessageId, setTargetMessageId] = useState<string | null>(null);

  const {
    isLoading,
    queryResult,
    searchMessage,

    handleSearch,
    closeModal,
    highlightText,
    scrollToMessage,
  } = useSearchMessage({
    fetchedMessages,
    searchQuery,
    setSearchQuery,
    setTargetMessageId,
    toggleSearch,
  });

  useEffect(() => {
    if (!targetMessageId) return;

    const rafId = requestAnimationFrame(() => {
      scrollToMessage(targetMessageId);
    });

    return () => cancelAnimationFrame(rafId);
  }, [targetMessageId, fetchedMessages.length]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 z-50 py-2 flex justify-center items-center transition duration-150 ${
          showSearch ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-gray-900 rounded-lg shadow-lg w-full h-full max-w-[600px] py-6 relative border
             border-gray-700 flex flex-col transition  ${
               showSearch
                 ? "duration-300"
                 : "scale-75 translate-y-1/2 duration-150 "
             }`}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
            onClick={closeModal}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-4 px-4 text-gray-200">
            Search Chat
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center mb-4 px-4"
          >
            <input
              type="search"
              className="bg-gray-700 bg-opacity-50 text-white px-4 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>

          <div className="h-full overflow-y-auto flex flex-col gap-0">
            {queryResult.map((result) => (
              <div
                key={result.messageId}
                onClick={(e) => {
                  scrollToMessage(result.messageId);
                  closeModal();
                }}
                className="bg-transparent px-4 cursor-pointer hover:bg-gray-700 hover:bg-opacity-40 transition duration-200 py-2 rounded-md flex items-center gap-3"
              >
                <Avatar
                  avatarName={result.username}
                  profilePicture={result.profilePicture}
                />
                <div>
                  <h3 className="text-[20px] font-medium text-white">
                    {result.username}
                  </h3>

                  <div className="flex items-center gap-2 text-[16px]">
                    <p className="text-gray-400">
                      {highlightText(result.content, searchQuery)}
                    </p>
                    <p className="text-gray-500">
                      {new Date(result.createdAt).toDateString().slice(0, 3)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading ? (
              <QuerySpinner />
            ) : searchMessage ? (
              <div className="flex flex-col gap-2 text-[18px] justify-center items-center px-16 text-center leading-tight h-32 text-gray-400">
                <span className="font-bold text-[20px] text-gray-100 ">
                  No results found
                </span>
                Try again with a different spelling, possibly. Try to use
                complete words for the most effective results.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toggleSearch();
          handleSearch();
        }}
        className="px-2 bg-[#292f36] rounded-md text-[16px] flex justify-center items-center max-md:hidden max-lg2:flex max-xl:hidden"
      >
        <input
          type="search"
          className="p-2 bg-transparent outline-none"
          placeholder="Search chat..."
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <button
          className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
          type="submit"
        >
          <Search size={24} />
        </button>
      </form>
    </>
  );
};

export default ChatroomSearch;
