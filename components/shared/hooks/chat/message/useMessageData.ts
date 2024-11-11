import {
  AttachmentViewModel,
  IMessage,
  IMessageReceipt,
} from "@/types/chatTypes";
import { AllMessageResponse } from "@/types/responseType";
import { useEffect, useState } from "react";
import useCustomSWR from "../../common/customSwr";
import { ecnf } from "@/utils/env";
import { useParams } from "next/navigation";

export default function useMessageData() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [readReceipts, setReadReceipts] = useState<IMessageReceipt[]>([]);
  const [attachmentsMap, setAttachmentsMap] = useState<
    Map<string, AttachmentViewModel>
  >(new Map());
  const [fetchMore, setFetchMore] = useState({
    isLoading: false,
    hasMore: true,
  });

  const chatId = useParams().chatId;

  const { data, mutate } = useCustomSWR<AllMessageResponse>(
    chatId ? `${ecnf.apiUrl}/chats/${chatId}/messages` : null,
    {
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.messages.length < 50) {
      setFetchMore((prev) => ({ ...prev, hasMore: false }));
    }

    setMessages(data.messages);
    setReadReceipts(data.allReceipts);
    setAttachmentsMap(
      new Map(
        data.attachments.map<[string, AttachmentViewModel]>((a) => [
          a.messageId as string,
          a,
        ])
      )
    );

    setFetchMore((prev) => ({ ...prev, isLoading: false }));
  }, [data]);

  return {
    messages,
    readReceipts,
    attachmentsMap,
    fetchMore,
    setFetchMore,
    mutate
  };
}
