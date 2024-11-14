"use client";
import { IUserMiniProfile } from "@/types/userTypes";
import Link from "next/link";
import { useState, useRef } from "react";
import { MiniProfileSkeleton } from "../../shared/ui/atoms/skeleton";
import { useAuth } from "../../shared/contexts/auth/authcontext";
import Image from "next/image";
import { ecnf } from "@/utils/constants/env";
import SearchComp from "../../shared/ui/atoms/searchComponent/searchComponent";
import SearchResultMessage from "./searchResultMessage";

export default function SearchPeopleComp() {
  const [people, setPeople] = useState<(IUserMiniProfile&{bio: string})[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortController = useRef<AbortController | null>(null); // Store abort controller
  const { checkAndRefreshToken } = useAuth();

  const [showMessage, setShowMessage] = useState({
    notFound: false,
    warning: false,
    default: true,
  });
  const queryRef = useRef("");

  const handleSubmit = async () => {
    setShowMessage({
      default: false,
      notFound: false,
      warning: false,
    });

    if (query.length < 2 || query.length > 30) {
      setShowMessage({
        default: false,
        notFound: false,
        warning: true,
      });
      return;
    }

    setIsLoading(true);

    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      const token = await checkAndRefreshToken();
      const result = await fetch(
        `${ecnf.apiUrl}/users?query=${encodeURIComponent(query)}`,
        {
          signal: abortController.current.signal,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (result.ok) {
        const data: { data: (IUserMiniProfile&{bio: string})[] } = await result.json();
        setPeople(data.data);
        if (data.data.length === 0) {
          queryRef.current = query;
          setShowMessage({
            default: false,
            notFound: true,
            warning: false,
          });
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching people:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchComp
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        title="Find People"
        placeHolder="Search people..."
        onSubmit={handleSubmit}
      />


      {isLoading && (
        <>
          {" "}
          <MiniProfileSkeleton width="w-full" />
          <MiniProfileSkeleton width="w-full" />
          <MiniProfileSkeleton width="w-full" />
          <MiniProfileSkeleton width="w-full" />
        </>
      )}

      <SearchResultMessage query={queryRef.current} showMessage={showMessage} />


      {people.map((person) => (
        <Link
          key={person.userId}
          href={`/search-people/${person.userId}`}
          className="flex items-center w-full py-3 hover:cursor-pointer px-4 bg-[#272f3a] shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-[#272e38]"
        >
          <div className="avatar w-12 h-12 bg-gray-700 rounded-full mr-4 flex justify-center items-center relative overflow-hidden">
            {person.profilePicture ? (
              <Image
                src={person.profilePicture}
                alt="Profile picture of the person"
                width={50}
                height={50}
              />
            ) : (
              person.username.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex-1 space-y-0.5">
            <h2 className="text-[18px] font-bold capitalize">
              {person.username}
            </h2>
            <p className="text-gray-400 text-[14px] truncate">
              {person.bio ? (
                person.bio.length > 40 ? (
                  person.bio.slice(0, 40).trimEnd() + "..."
                ) : (
                  person.bio
                )
              ) : (
                <span className="text-gray-400">
                  {" "}
                  No bio provided by the user{" "}
                </span>
              )}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
