"use client";
import { IUserMiniProfile } from "@/types/userTypes";
import { AlertCircle, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { MiniProfileSkeleton } from "../skeletons/skeleton";
import { useAuth } from "../authComps/authcontext";
import Image from "next/image";
import { ecnf } from "@/utils/env";

export default function SearchPeopleComp() {
  const [people, setPeople] = useState<IUserMiniProfile[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Store timeout ID
  const abortController = useRef<AbortController | null>(null); // Store abort controller
  const { checkAndRefreshToken } = useAuth();

  const [showMessage, setShowMessage] = useState({
    notFound: false,
    warning: false,
    default: true,
  });

  const queryRef = useRef("");
  useEffect(() => {
    setPeople([]);
    if (!showMessage.notFound) {
      queryRef.current = query;
    }

    const findPeople = async () => {
      setShowMessage({
        default: false,
        notFound: false,
        warning: false,
      });
      setIsLoading(true);

      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      try {
        const token = await checkAndRefreshToken();
        const result = await fetch(
          `${ecnf.apiUrl}/users?query=${encodeURIComponent(
            query
          )}`,
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
          if (data.data.length === 0) {
            queryRef.current = query;
            setShowMessage({
              default: false,
              notFound: true,
              warning: false,
            });
          }
        } else {
          console.error("Error fetching people:", result.statusText);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching people:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    let warningTimer: NodeJS.Timeout;

    if (query.length > 1 && query.length < 30) {
      debounceTimeout.current = setTimeout(() => {
        findPeople();
      }, 500);
    } else if (query.trim() === "") {
      setShowMessage({
        warning: false,
        default: true,
        notFound: false,
      });
    } else {
      if (!showMessage.notFound) {
        warningTimer = setTimeout(() => {
          setShowMessage({
            default: false,
            notFound: false,
            warning: true,
          });
        }, 600);
      } else {
        setShowMessage({
          default: false,
          notFound: false,
          warning: true,
        });
      }
    }

    // Cleanup on component unmount

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
      clearTimeout(warningTimer);
    };
  }, [query]);

  const renderMessage = () => {
    if (showMessage.default) {
      return (
        <div
          className={`text-center p-6 bg-gray-800 bg-opacity-70 rounded-lg w-80 shadow-lg`}
        >
          <Users className="mx-auto mb-4 text-blue-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Discover People
          </h3>
          <p className="text-gray-400">
            Start typing to find interesting people in the community
          </p>
        </div>
      );
    } else if (showMessage.warning) {
      return (
        <div
          className={`text-center p-6 bg-gray-800 bg-opacity-70 rounded-lg w-80 shadow-lg`}
        >
          <AlertCircle className="mx-auto mb-4 text-yellow-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Keep Typing
          </h3>
          <p className="text-gray-400">
            Please enter at least 2 characters to start searching.
          </p>
        </div>
      );
    } else if (showMessage.notFound) {
      return (
        <div
          className={`text-center p-6 bg-gray-800 bg-opacity-70 rounded-lg w-80 shadow-lg`}
        >
          <AlertCircle className="mx-auto mb-4 text-yellow-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-400">
            We couldn't find anyone matching "{queryRef.current}". Try a
            different search term.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>

      <div className="relative mb-6 bg-gray-700 w-80 bg-opacity-50 rounded-md flex items-center">
        <Search className="absolute left-3" />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full focus:border-gray-600 border-transparent py-3 bg-transparent text-[18px] border-2 pl-10 pr-4 rounded-md text-gray-300 placeholder-gray-400 outline-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
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

      {renderMessage()}

      {/* Display search results */}
      {people.map((person) => (
        <Link
          key={person.userId}
          href={`/search-people/${person.userId}`}
          className="flex items-center w-80 py-3 hover:cursor-pointer px-4 bg-[#272f3a] shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-[#272e38]"
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
