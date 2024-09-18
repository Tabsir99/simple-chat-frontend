"use client";

import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsChat } from "react-icons/bs";

export default function SideBarNav() {
  const [activeRoute, setActiveRoute] = useState("");
  const pathName = usePathname();

  useEffect(() => {
    setActiveRoute(pathName);
  }, [pathName]);

  return (
    <ul className="space-y-2 flex flex-col items-center">
      <li
        className={
          "flex items-center justify-center w-fit rounded-lg cursor-pointer " +
          (activeRoute.includes("/chats") && !activeRoute.includes("/favorites") ? "bg-blue-500" : "hover:bg-gray-700")
        }
      >
        <Link href="/chats" className="p-3 block">
          <BsChat className="text-white" size={20} aria-label="Favorite" />
        </Link>
      </li>
      <li
        className={
          "flex items-center justify-center w-fit rounded-lg cursor-pointer " +
          (activeRoute === "/chats/favorites"
            ? "bg-blue-500"
            : "hover:bg-gray-700")
        }
      >
        <Link href="/chats/favorites" className="p-3 block">
          <Heart className="text-white" size={20} aria-label="Favorite" />
        </Link>
      </li>
      <li
        className={
          "flex items-center justify-center w-fit rounded-lg cursor-pointer " +
          (activeRoute === "/search-people"
            ? "bg-blue-500"
            : "hover:bg-gray-700")
        }
      >
        <Link href="/search-people" className="p-3 block">
          {" "}
          <Search className="text-white" size={20} aria-label="Search People" />
        </Link>
      </li>
    </ul>
  );
}
