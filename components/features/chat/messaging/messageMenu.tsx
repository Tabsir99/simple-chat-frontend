import { MoreVertical, Reply, Pencil, Trash, Copy } from "lucide-react";
import { IMenu, IMessage } from "@/types/chatTypes";
import {
  ComponentType,
  Dispatch,
  PointerEventHandler,
  SetStateAction,
  useState,
} from "react";
import ToastNotification from "@/components/shared/ui/atoms/ToastNotification";

export default function MessageMenu({
  onDelete,
  toggleMessageEdit,
  setReplyingTo,
  handleToggleMenu,
  menu,
}: {
  onDelete: (messageId: string) => void;
  toggleMessageEdit: (initMsg: string) => void;
  setReplyingTo: (messageId: string) => void;
  handleToggleMenu: () => void;
  menu: IMenu;
}) {
  const [showMsg, setShowMsg] = useState<{
    content: string;
    hasFailed: boolean;
  }>({ content: "", hasFailed: false });
  const menuItems = [
    {
      Icon: Reply,
      handleClick: () => {
        const msgInput = document.getElementById("msgInput");
        setReplyingTo(menu.message?.messageId || "");
        msgInput?.focus();

        handleToggleMenu();
      },
      text: "Reply",
    },
    {
      Icon: Copy,
      handleClick: () => {
        try {
          const msgNodes = document.getElementById(
            `${menu.message?.messageId}`
          )?.childNodes;
          const msgContent =
            msgNodes?.[msgNodes.length - 1].firstChild?.textContent;
          if (msgContent) {
            navigator.clipboard.writeText(msgContent);
            setShowMsg({ content: "Message Copied", hasFailed: false });
          } else {
            throw new Error("No message");
          }
        } catch (error) {
          setShowMsg({ content: "Failed to copy message", hasFailed: true });
        } finally {
          handleToggleMenu();
        }
      },
      text: "Copy",
    },
    ...(menu.message?.isCurrentUserSender
      ? [
          {
            Icon: Pencil,
            handleClick: () => {
              const msgContent = document.getElementById(
                `${menu.message?.messageId}`
              )?.lastElementChild?.textContent;
              if (msgContent) {
                toggleMessageEdit(msgContent);
              }
            },
            text: "Edit",
          },
          {
            Icon: Trash,
            handleClick: () => {
              if (menu.message) {
                onDelete(menu.message.messageId);
              }
              handleToggleMenu();
            },
            text: "Delete",
          },
        ]
      : []),
  ];

  return (
    <div>
      {showMsg.content && (
        <ToastNotification
          message={showMsg.content}
          type={showMsg.hasFailed ? "error" : "success"}
          handleClose={() => {
            setShowMsg({ content: "", hasFailed: false });
          }}
        />
      )}
      <div
        className={`absolute flex justify-center gap-4 items-center w-full h-14 max-xl2:h-20 px-16 max-xs:px-4 bottom-0 right-0 
        bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50 transition-transform duration-300
        max-xs:gap-1
         ${menu.message ? "" : "translate-y-full"}`}
      >
        {menuItems.map((menuItem) => {
          return (
            <MenuButton
              key={menuItem.text}
              Icon={menuItem.Icon}
              handleClick={(e) => {
                e.preventDefault();
                menuItem.handleClick();
              }}
              text={menuItem.text}
            />
          );
        })}
      </div>
    </div>
  );
}

const MenuButton = ({
  handleClick,
  Icon,
  text,
}: {
  handleClick: PointerEventHandler<HTMLButtonElement>;
  Icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) => {
  return (
    <button
      onClick={handleClick}
      className="flex gap-2 justify-center items-center w-28 h-10 max-xl2:w-16 max-xl2:h-16 rounded-full transition-colors duration-200 
       hover:bg-gray-700 max-md:w-14 max-md:h-14 max-xl2:flex-col max-xl2:gap-0.5 max-xl2:text-[16px]"
    >
      <Icon className="w-[24px] h-[24px] max-xs:w-[20px] max-xs:h-[20px] " />{" "}
      {text}
    </button>
  );
};
