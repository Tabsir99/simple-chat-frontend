"use client";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import MediaModal from "../mediaModal";

const options = [
  { item: "Group Info" },
  { item: "Group Media" },
  { item: "Clear Chat" },
  { item: "Exit Group" },
];

export default function GroupHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isGroupInfoModalOpen, setIsGroupInfoModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMediaModal = () => {
    setIsMediaModalOpen((prev) => !prev);
  };

  const toggleGroupInfoModal = () => {
    setIsGroupInfoModalOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    if (option === "Group Info") {
      toggleGroupInfoModal();
    }
    if (option === "Exit Group") {
      console.log("Leave Group clicked");
    }
    if (option === "Media") {
      toggleMediaModal();
    }
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener
      );
    };
  }, []);

  return (
    <div className="bg-[#1f2329] flex items-center justify-between px-4 py-2 border-b border-gray-700 relative">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
          <span className="text-[18px]">GC</span>
        </div>
        <div>
          <h2 className="text-white text-[18px] font-semibold">Group Chat</h2>
          <p className="text-[14px] text-green-400">Active</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 relative">
        <button
          className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
          onClick={toggleDropdown}
        >
          <MoreHorizontalIcon className="w-6 h-6" />
        </button>

        <div
          ref={dropdownRef}
          className={
            "absolute py-2 w-40 top-full right-0 mt-2 bg-gray-800 text-white rounded-lg shadow-xl px-3 border border-gray-600 overflow-hidden origin-top " +
            (isDropdownOpen ? "transition-transform duration-200" : "scale-y-0")
          }
        >
          {options.map(({ item }) => (
            <button
              key={item}
              className="w-full rounded-lg text-left px-3 py-2.5 flex gap-1 text-[18px] items-center hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors duration-200"
              onClick={() => handleOptionClick(item)}
            >
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Media Modal */}
      {isMediaModalOpen && <MediaModal toggleMediaModal={toggleMediaModal} />}
      {/* Group Info Modal */}
      {/* {isGroupInfoModalOpen && <GroupInfoModal toggleGroupInfoModal={toggleGroupInfoModal} />} */}
    </div>
  );
}
