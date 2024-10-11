"use client";
import { IUserMiniProfile } from "@/types/userTypes";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { MiniProfileSkeleton } from "../skeletons/skeleton";
import { useAuth } from "../authComps/authcontext";
import Image from "next/image";

export default function SearchPeopleComp() {
  const [people, setPeople] = useState<IUserMiniProfile[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Store timeout ID
  const abortController = useRef<AbortController | null>(null); // Store abort controller
  const { checkAndRefreshToken } = useAuth();

  useEffect(() => {
    const findPeople = async () => {
      if (query.trim() === "") {
        setPeople([]);
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
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/users?query=${encodeURIComponent(query)}`,
          {
            signal: abortController.current.signal,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (result.ok) {
          const data: { data: IUserMiniProfile[] } = await result.json();
          setPeople(data.data);
        } else {
          console.error("Error fetching people:", result.statusText);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching people:", error);
        }
      } finally {
        setIsLoading(false); // Stop loading state
      }
    };

    // Debounce logic
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear previous timeout
    }

    if (query.length > 1 && query.length < 30) {
      debounceTimeout.current = setTimeout(() => {
        findPeople();
      }, 500); // 600ms debounce delay
    }

    // Cleanup on component unmount
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [query]);

  return (
    <>
      <div className="relative mb-6 bg-gray-700 w-80 bg-opacity-50 overflow-hidden rounded-md flex items-center px-3">
        <Search />
        <input
          type="text"
          placeholder="Search people..."
          className="w-full p-3 bg-transparent text-[18px] rounded-lg text-gray-300 placeholder-gray-400 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Optionally show a loading indicator */}
      {isLoading && (
        <>
          {" "}
          <MiniProfileSkeleton />
          <MiniProfileSkeleton />
          <MiniProfileSkeleton />
          <MiniProfileSkeleton />
        </>
      )}

      {/* Display search results */}
      {people.map((person) => (
        <Link
          key={person.userId}
          href={`/search-people/${person.userId}`}
          className="flex items-center w-80 py-3 hover:cursor-pointer px-4 bg-[#252a32] rounded-lg transition-all duration-300 ease-in-out hover:bg-[#272e38]"
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
