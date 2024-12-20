import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import Avatar from "@/components/shared/ui/atoms/profileAvatar/profileAvatar";
import { IMessage, IMessageReceipt } from "@/types/chatTypes";
import { Fragment, useEffect, useMemo } from "react";

const MessageRecipt = ({
  allReadRecipts,
  messageId,
  isPrivateChat,
  isCurrentUserSender,
  messageStatus,
}: {
  allReadRecipts: IMessageReceipt[];
  messageId: string;
  isPrivateChat: boolean;
  isCurrentUserSender: boolean;
  messageStatus: IMessage["status"];
}) => {
  const currentUserId = useAuth().user?.userId;
  const readersToShow = useMemo(
    () =>
      allReadRecipts.filter(
        (receipt) =>
          receipt.reader.userId !== currentUserId &&
          receipt.lastReadMessageId === messageId
      ),
    [messageId, allReadRecipts, currentUserId]
  );

  const currentUserR = useMemo(
    () =>
      allReadRecipts.filter(
        (r) =>
          r.reader.userId === currentUserId && r.lastReadMessageId === messageId
      )[0],
    [allReadRecipts, currentUserId, messageId]
  );

  return (
    <div
      className={` flex items-center justify-end text-xs text-gray-400
           self-end
        `}
    >
      {currentUserR && isCurrentUserSender && readersToShow.length === 0 && (
        <span className="pt-1"> {messageStatus} </span>
      )}

      <div
        className={`flex items-center gap-0.5 mt-1 ${
          readersToShow.length > 0 ? "mb-2" : ""
        }`}
      >
        {readersToShow.map((reader, index) => (
          <Fragment key={reader.reader.userId}>
            <span className="mr-1">
              {isPrivateChat ? (isCurrentUserSender ? "seen" : "") : "Read By:"}
            </span>
            {!isPrivateChat && (
              <Avatar
                avatarName={reader.reader.username}
                profilePicture={reader.reader.profilePicture}
                className=" w-6 h-6 text-[14px] "
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MessageRecipt;
