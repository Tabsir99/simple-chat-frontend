import { IMessage } from "@/types/chatTypes";

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isWithin24Hours = now.getTime() - date.getTime() < 24 * 60 * 60 * 1000;

  if (isToday || isWithin24Hours) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${amPm}`;
  } else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function buildSystemMessage({
  content,
  createdAt,
  messageId,
}: {
  content: string;
  createdAt: string;
  messageId: string;
}): IMessage {
  return {
    content: content,
    createdAt: createdAt,
    messageId: messageId,
    type: "system" as const,
    sender: null,
    status: "delivered" as const,
    MessageReaction: [],
    parentMessage: null,
    callInformation: null,
  };
}

export const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
