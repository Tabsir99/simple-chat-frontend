"use client";

import SearchPeopleComp from "@/components/features/connections/searchpeople";
import { useParams, usePathname } from "next/navigation";

export default function SearchPeople({
  children,
}: {
  children: React.ReactNode;
}) {
  const param = useParams();
  const currentPath = usePathname();
  return (
    <>
      <div className="h-full bg-[#1b1b1b] w-full text-gray-100 flex">
        <div
          className={`people-list w-[600px] px-4 space-y-4 bg-[#1a222d] bg-opacity-90  max-md:min-w-full ${
            (param.profileId || currentPath.includes("friends")) &&
            "max-lg:hidden"
          }`}
        >
          <SearchPeopleComp />
        </div>

        <section className="bg-[#292f36] w-full">{children}</section>
      </div>
    </>
  );
}
