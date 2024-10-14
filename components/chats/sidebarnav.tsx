"use client";

import { Heart, Search, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsChat } from "react-icons/bs";
import { useUserInteractions } from "../contextProvider/userInteractionContext";

const navItems = [
  { href: "/chats", icon: BsChat, label: "Chats" },
  { href: "/chats/favorites", icon: Heart, label: "Favorites" },
  { href: "/search-people/friends", icon: Users, label: "Friends" },
  { href: "/search-people", icon: Search, label: "Search People" },
];

export default function SideBarNav() {
  const [activeRoute, setActiveRoute] = useState("");
  const pathName = usePathname();
  const { state } = useUserInteractions();

  useEffect(() => {
    setActiveRoute(pathName);
  }, [pathName]);

  const getAlertCount = (href: string) => {
    switch (href) {
      case "/chats":
        return state.newMessagesCount;
      case "/search-people/friends":
        return state.pendingFriendRequests + state.unseenAcceptedFriendRequests;
      default:
        return 0;
    }
  };

  return (
    <ul className="gap-3 flex flex-col items-center">
      {navItems.map((item) => {
        const alertCount = getAlertCount(item.href);
        const isActive = 
          activeRoute === item.href ||
          (item.href === "/chats" &&
            activeRoute.includes("/chats") &&
            !activeRoute.includes("/favorites"));

        return (
          <li
            key={item.href}
            className="relative"
          >
            <Link 
              href={item.href} 
              className={`
                flex items-center justify-center w-10 h-10 rounded-xl
                transition-all duration-300 ease-in-out
                ${isActive 
                  ? "bg-blue-500 text-white shadow-lg" 
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"}
              `}
            >
              <item.icon size={24} aria-label={item.label} />
              {alertCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-[22px] h-[18px] text-[12px] font-bold text-white bg-red-500 rounded-full p-2 transform translate-x-1/3 -translate-y-1/3">
                  {alertCount > 99 ? '99+' : alertCount}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}