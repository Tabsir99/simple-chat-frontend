"use client";
import { useState, MouseEvent, useEffect, useRef } from "react";
import { MoreVertical, Search, User, Image, Ban, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaModal from "./mediaModal";



const options = [
  {
    item: "Profile",
    icon: <User className="text-gray-400" size={18} />,
  },
  { item: "Media", icon: <Image className="text-gray-400" size={18} /> },
  { item: "Favorite", icon: <Heart className="text-gray-400" size={18} /> },
  { item: "Block", icon: <Ban className="text-gray-400" size={18} /> },
];

export default function ChatHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMediaModal = () => {
    setIsMediaModalOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    if (option === "Profile") {
      return router.push("/profile/profile1");
    }
    if (option === "Media") {
      toggleMediaModal();
    }
    console.log(`${option} clicked`);
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        <Link href="/profile/profile1" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
          <span className="text-[18px]">JD</span>
        </Link>
        <div>
          <h2 className="text-white text-[18px] font-semibold">John Doe</h2>
          <p className="text-[14px] text-green-400">Online</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 relative">
        <div className="px-2 bg-[#292f36] rounded-md text-[16px] flex justify-center items-center">
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
        <button
          className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
          onClick={toggleDropdown}
        >
          <MoreVertical size={24} />
        </button>

        <div
          ref={dropdownRef}
          className={
            "absolute py-2 w-32 top-full right-0 mt-2 bg-gray-800 text-white rounded-lg shadow-xl px-3 border border-gray-600 overflow-hidden origin-top " +
            (isDropdownOpen ? "transition-transform duration-200" : "scale-y-0")
          }
        >
          {options.map(({ item, icon }) => (
            <button
              key={item}
              className="w-full rounded-lg text-left px-3 py-2.5 flex gap-1 text-[18px] items-center hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors duration-200"
              onClick={() => handleOptionClick(item)}
            >
              {icon}
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>

      {isMediaModalOpen && (
        <MediaModal toggleMediaModal={toggleMediaModal} />
      )}

    </div>
  );
}