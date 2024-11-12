import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../contexts/auth/authcontext";
import { useLocalStorage } from "../storage/useLocalStorage";
import { ecnf } from "@/utils/env";
import { useParams, useRouter } from "next/navigation";
import { AllMessageResponse, ApiResponse } from "@/types/responseType";
import { IChatHead } from "@/types/chatTypes";
import { useChatContext } from "../../contexts/chat/chatContext";
import { useCommunication } from "../../contexts/communication/communicationContext";
import useMessageData from "./message/useMessageData";

export default function useChatRoom() {
  // console.log(messagesRef.current.length, "from ref")

  const { checkAndRefreshToken } = useAuth();

  const { saveFile, getFileUrl } = useLocalStorage();
  const [selectedActiveChat, setSelectedActiveChat] =
    useState<IChatHead | null>(null);
  const { showNotification } = useCommunication();
  const {
    attachmentsMap,
    fetchMore,
    messages,
    setFetchMore,
    readReceipts,
    mutate,
  } = useMessageData(selectedActiveChat?.chatRoomId);

  const router = useRouter();
  const chatRoomId = useParams().chatId;

  useEffect(() => {
    if (messages.length < 1) return;

    const observer = new IntersectionObserver(
      (entry) => {
        entry.forEach(async (el) => {
          if (!el.isIntersecting) return;

          const lastM = messages[messages.length - 1];
          if (el.target.id === lastM.messageId) {
            if (fetchMore.hasMore && !fetchMore.isLoading) {
              setFetchMore((prev) => ({ ...prev, isLoading: true }));

              const token = await checkAndRefreshToken();
              const res = await fetch(
                `${ecnf.apiUrl}/chats/${chatRoomId}/messages?createdAt=${lastM.createdAt}&messageId=${lastM.messageId}`,
                {
                  method: "GET",
                  cache: "no-cache",
                  headers: { authorization: `Bearer ${token}` },
                }
              );
              if (res.ok) {
                const data: ApiResponse<
                  Omit<AllMessageResponse, "allReceipts">
                > = await res.json();
                if (data.data) {
                  mutate((current: AllMessageResponse | undefined) => {
                    if (!current) return current;
                    return {
                      ...current,
                      messages: [
                        ...current.messages,
                        ...(data.data?.messages || []),
                      ],
                    };
                  }, false);
                }
              }
            }
          }

          if (attachmentsMap.get(el.target.id)?.fileUrl) return;

          const url = await getFileUrl(`${chatRoomId}-${el.target.id}`);
          if (url) {
            mutate((current: AllMessageResponse | undefined) => {
              if (!current) return current;
              return {
                allReceipts: current.allReceipts,
                messages: current.messages,
                attachments: current.attachments.map((a) =>
                  a.messageId !== el.target.id
                    ? a
                    : { ...a, fileUrl: url as string }
                ),
              };
            }, false);
            return;
          }
          const token = await checkAndRefreshToken();
          const response = await fetch(
            `${ecnf.apiUrl}/chats/${chatRoomId}/messages/${
              el.target.id
            }/files?fileName=${attachmentsMap.get(el.target.id)?.fileName}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data: ApiResponse<string> = await response.json();
            if (!data.data) return;

            setTimeout(async () => {
              const res = await fetch(data.data as string);
              const file = await res.blob();
              console.log(
                "Fetching file as url doesnt exist in localstorage. blob:",
                file
              );
              await saveFile(file, chatRoomId as string, el.target.id);
            }, 2000);

            mutate((current: AllMessageResponse | undefined) => {
              if (!current) return current;
              return {
                allReceipts: current.allReceipts,
                messages: current.messages,
                attachments: current.attachments.map((a) =>
                  a.messageId !== el.target.id
                    ? a
                    : { ...a, fileUrl: data.data as string }
                ),
              };
            }, false);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    for (const [key] of attachmentsMap) {
      const msgToObserve = document.getElementById(key);
      if (msgToObserve) observer.observe(msgToObserve);
    }

    const oldestMessage = document.getElementById(
      messages[messages.length - 1].messageId
    );
    if (oldestMessage) observer.observe(oldestMessage);

    return () => {
      observer.disconnect();
    };
  }, [messages.length, attachmentsMap, fetchMore]);

  const { activeChats } = useChatContext();

  useLayoutEffect(() => {
    if (activeChats) {
      const activeChat = activeChats.find(
        (chat) => chat.chatRoomId === chatRoomId
      );
      if (!activeChat) {
        showNotification("Failed to load chat", "error");
        router.push("/chats");
      } else {
        setSelectedActiveChat(activeChat);
      }
    }
  }, [activeChats]);

  return {
    selectedActiveChat,
    fetchMore,
    attachmentsMap,
    readReceipts,
    messages,
    mutate,
  };
}
