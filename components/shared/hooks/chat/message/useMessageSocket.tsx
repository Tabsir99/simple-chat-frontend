import { AllMessageResponse } from "@/types/responseType";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { KeyedMutator } from "swr";

export default function useMessageSocket({
  socket,
  mutate,
}: {
  socket: Socket | null;
  mutate: KeyedMutator<AllMessageResponse>;
}) {
  useEffect(() => {
    if (!socket) return;

    // Listen for status updates from server
    const handleStatusUpdate = ({
      messageId,
      status,
      readBy,
    }: {
      messageId: string;
      status: "sent" | "delivered" | "failed";
      readBy: string[];
    }) => {
      mutate((currentData) => {
        if (!currentData) return currentData;

        const readerSet = new Set(readBy);

        const newData: AllMessageResponse = {
          attachments: currentData.attachments,
          messages: currentData.messages.map((msg) => {
            return msg.messageId !== messageId
              ? msg
              : { ...msg, status: status };
          }),
          allReceipts:
            status === "failed"
              ? currentData.allReceipts
              : currentData.allReceipts.map((or) => {
                  if (readerSet.has(or.reader.userId)) {
                    return {
                      reader: or.reader,
                      lastReadMessageId: messageId,
                    };
                  }
                  return or;
                }),
        };

        return newData;
      }, false);
    };

    socket.on("message:status", handleStatusUpdate);

    return () => {
      socket.off("message:status");
    };
  }, [socket, mutate]);
}
