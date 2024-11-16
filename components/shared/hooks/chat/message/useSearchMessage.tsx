import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { IMessage } from "@/types/chatTypes";
import { ApiResponse } from "@/types/responseType";
import { ecnf } from "@/utils/constants/env";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

interface SearchMessageResult {
  messageId: string;
  content: string;
  createdAt: string;
  username: string;
  profilePicture: string;
}

interface UseSearchMessageProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  toggleSearch: () => void;
  fetchedMessages: IMessage[];
  setTargetMessageId: Dispatch<SetStateAction<string | null>>;
}
export default function useSearchMessage({
  fetchedMessages,
  searchQuery,
  setSearchQuery,
  toggleSearch,
  setTargetMessageId,
}: UseSearchMessageProps) {
  const [queryResult, setQueryResult] = useState<SearchMessageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState<boolean>(false);

  const { checkAndRefreshToken } = useAuth();
  const chatRoomId = useParams().chatId;

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    const regex = new RegExp(`(${searchTerms.join("|")})`, "gi");

    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) => {
          const isMatch = searchTerms.some((term) =>
            part.toLowerCase().includes(term.toLowerCase())
          );

          return isMatch ? (
            <span key={i} className="text-white">
              {part}
            </span>
          ) : (
            part
          );
        })}
      </>
    );
  };

  const handleSearch = async () => {
    if (searchQuery.length < 1) return;
    if (searchQuery.length > 100) {
      setSearchMessage(true);
      setQueryResult([]);
      return;
    }

    setIsLoading(true);
    setSearchMessage(false);

    try {
      const token = await checkAndRefreshToken();

      const response = await fetch(
        `${ecnf.apiUrl}/messages?query=${searchQuery}&chatRoomId=${chatRoomId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = (await response.json()) as ApiResponse<
          SearchMessageResult[]
        >;
        setQueryResult(data.data as SearchMessageResult[]);

        if (data.data?.length === 0) {
          setSearchMessage(true);
        }
      } else {
        setSearchMessage(false);
        setQueryResult([]);
      }
    } catch (error) {
      setSearchMessage(false);
      setQueryResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  const highlightMessage = (element: HTMLElement) => {
    element.classList.add("highlight-search-result");
    setTimeout(() => element.classList.remove("highlight-search-result"), 3000);
  };

  const closeModal = () => {
    setQueryResult([]);
    setSearchQuery("");
    setSearchMessage(false);
    toggleSearch();
  };

  const scrollToMessage = async (targetMessageId: string) => {
    const targetMessageEl = document.getElementById(targetMessageId);

    if (targetMessageEl) {
        targetMessageEl.classList
      targetMessageEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });

      highlightMessage(targetMessageEl);
      setTargetMessageId(null);
      
    } else {
      const lastFetchedMessage = document.getElementById(
        fetchedMessages[fetchedMessages.length - 1].messageId
      );

      setTargetMessageId(targetMessageId);
      lastFetchedMessage?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  return {
    queryResult,
    isLoading,
    searchMessage,

    handleSearch,
    highlightMessage,
    closeModal,
    highlightText,
    scrollToMessage,
  };
}
