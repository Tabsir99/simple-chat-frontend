"use client";

import { Heart, Search, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsChat } from "react-icons/bs";
import { useRecentActivities } from "../shared/contexts/chat/recentActivityContext";

const navItems = [
  { href: "/chats", icon: BsChat, label: "Chats" },
  { href: "/search-people/friends", icon: Users, label: "Friends" },
  { href: "/search-people", icon: Search, label: "Find People" },
];

export default function SideBarNav() {
  const [activeRoute, setActiveRoute] = useState("");
  const pathName = usePathname();
  const { activities } = useRecentActivities();

  useEffect(() => {
    setActiveRoute(pathName);
  }, [pathName]);

  const getAlertCount = (href: string) => {
    switch (href) {
      case "/chats":
        return activities.unseenChats;
      case "/search-people/friends":
        return activities.friendRequests + activities.acceptedFriendRequests;
      default:
        return 0;
    }
  };

  return (
    <ul className="flex flex-col items-center gap-2 px-1">
      {navItems.map((item) => {
        const alertCount = getAlertCount(item.href);
        const isActive = 
          activeRoute === item.href ||
          (item.href === "/chats" &&
            activeRoute.includes("/chats") &&
            !activeRoute.includes("/favorites"));

        return (
          <li key={item.href} className=" w-full ">
            <Link 
              href={item.href} 
              className={`
                relative flex items-center justify-center gap-3 p-3 rounded-xl
                transition-all duration-200 group
                ${isActive 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"}
              `}
            >
              <item.icon 
                size={20} 
                className="min-w-[20px]"
                aria-label={item.label} 
              />
              {/* Label - Hidden on large screens */}
              <span className="lg:hidden">{item.label}</span>
              
              {/* Tooltip - Shown only on large screens on hover */}
              <span className="hidden lg:block lg:absolute lg:left-16 lg:bg-gray-800 lg:px-2 lg:py-1 lg:rounded lg:text-sm lg:opacity-0 lg:group-hover:opacity-100 lg:pointer-events-none lg:whitespace-nowrap">
                {item.label}
              </span>

              {/* Alert Counter */}
              {alertCount > 0 && (
                <span className={`
                  flex items-center justify-center min-w-[22px] h-[18px] 
                  text-[12px] font-bold text-white bg-red-500 rounded-full px-1
                  ${!isActive ? "bg-red-500" : "bg-white text-blue-500"}
                  lg:absolute lg:top-0 lg:right-0 lg:transform lg:translate-x-1/3 lg:-translate-y-1/3
                  lg:group-hover:translate-x-1/2
                `}>
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