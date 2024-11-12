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
  
    // useEffect(() => {
    //   console.log(allReadRecipts)
    // },[])
    return (
      <div
        className={` flex items-center justify-end text-xs text-gray-400
          ${
            readersToShow.length !== 0 && !isPrivateChat ? "py-2  mt-3 h-6" : ""
          } self-end
        `}
      >
        {currentUserR &&
          isCurrentUserSender &&
          readersToShow.length === 0 &&
          messageStatus}
        <div className="flex items-center gap-0.5">
          {readersToShow.length > 0 &&
            readersToShow.map((reader, index) => (
              <Fragment key={reader.reader.userId}>
                <span className="mr-1">
                  {isPrivateChat
                    ? isCurrentUserSender
                      ? "seen"
                      : ""
                    : "Read By:"}
                </span>
                {!isPrivateChat && (
                  <Avatar
                    avatarName={reader.reader.username}
                    profilePicture={reader.reader.profilePicture}
                  />
                )}
              </Fragment>
            ))}
        </div>
      </div>
    );
  };
  
export default MessageRecipt