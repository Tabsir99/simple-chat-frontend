import { MoreVertical, Reply, Pencil, Trash } from "lucide-react";
import { IMessage } from "@/types/chatTypes";
import { Dispatch, SetStateAction, useState } from "react";
import { useAuth } from "@/components/authComps/authcontext";

export default function MessageMenu({
  message,
  onDelete,
  setIsEditing,
  setReplyingTo,
}: {
  message: IMessage;
  onDelete: (messageId: string) => void;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setReplyingTo: Dispatch<SetStateAction<IMessage | null>>;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const currentUser = useAuth().user

  return (
    <>
      {!message.isDeleted && (
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-0 -right-1 z-40 hover:bg-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"
        >
          <MoreVertical size={18} />
        </button>
      )}

      {showMenu && (
        <div className="absolute top-8 right-0 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-20">
          <button
            onClick={() => {
              const msgInput = document.getElementById("msgInput");
              setReplyingTo(message);
              setShowMenu(false);
              msgInput?.focus();
            }}
            className="flex gap-2 justify-center items-center px-4 py-2 hover:bg-gray-700"
          >
            <Reply /> Reply
          </button>
          {message.sender?.userId === currentUser?.userId  && (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full"
              >
                <Pencil size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onDelete(message.messageId);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-red-400"
              >
                <Trash size={16} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
