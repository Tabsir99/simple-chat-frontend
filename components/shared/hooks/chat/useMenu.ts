import { IMenu } from "@/types/chatTypes";
import { RefObject, useEffect, useState } from "react";

export default function useMenu(divRef: RefObject<HTMLDivElement>) {
  const [menu, setMenu] = useState<IMenu>({
    message: null,
    position: null,
    showEmojiPicker: false,
  });
  const [isEditing, setIsEditing] = useState("");

  const LONG_PRESS_DURATION = 700;
  const REACTION_BUTTON_WIDTH = 340;

  const calculateMenuPosition = (e: PointerEvent | MouseEvent) => {
    const viewportWidth = window.innerWidth;

    let left = e.clientX;
    let top = e.clientY - 60;

    if (viewportWidth < 560) {
      left = (viewportWidth - REACTION_BUTTON_WIDTH) / 2;
      top = top - 40;
    } else if (left + REACTION_BUTTON_WIDTH > viewportWidth) {
      left = viewportWidth - REACTION_BUTTON_WIDTH - 80;
    }

    return { top, left };
  };

  const closeMenu = () => {
    setMenu((prev) => ({
      message: null,
      position: prev.position,
      showEmojiPicker: false,
    }));
    setIsEditing("");
  };

  const handleEmojiPickerToggle = () => {
    setMenu((prev) => {
      return { ...prev, showEmojiPicker: !prev.showEmojiPicker };
    });
  };

  const openMenu = (e: PointerEvent | MouseEvent, msgNode: HTMLElement) => {
    const position = calculateMenuPosition(e);

    setMenu({
      message: {
        messageId: msgNode.id,
        isCurrentUserSender: msgNode.dataset.sender ? true : false,
        isDeleted: msgNode.dataset.isDeleted ? true : false,
      },
      position,
      showEmojiPicker: false,
    });
  };

  const toggleMessageEdit = (initMsg: string) => {
    setIsEditing((prev) => (prev ? "" : initMsg));

    setMenu((prev) => ({
      showEmojiPicker: false,
      position: prev.position,
      message: prev.message,
    }));
  };

  useEffect(() => {
    const allMessageContainer = divRef.current;
    if (!allMessageContainer) return;

    let pressTimer: NodeJS.Timeout;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest("#reactionButton")) {
        setMenu((prev) => ({
          message: prev.showEmojiPicker ? prev.message : null,
          position: prev.position,
          showEmojiPicker: false,
        }));
      }

      const msgNode = target.closest(".messageContent") as HTMLElement;
      if (!msgNode) return;
      pressTimer = setTimeout(() => {
        openMenu(e, msgNode);
      }, LONG_PRESS_DURATION);
    };

    const handlePointerUp = () => {
      clearTimeout(pressTimer);
    };

    const handleRightClick = (e: MouseEvent) => {
      const targetEl = (e.target as HTMLElement).closest(
        ".messageContent"
      ) as HTMLElement;
      if (!targetEl) {
        return setMenu((prev) => ({
          message: null,
          position: prev.position,
          showEmojiPicker: false,
        }));
      }

      e.preventDefault();
      openMenu(e, targetEl);
    };
    allMessageContainer.addEventListener("pointerdown", handlePointerDown);
    allMessageContainer.addEventListener("pointerup", handlePointerUp);
    allMessageContainer.addEventListener("pointercancel", handlePointerUp);
    allMessageContainer.addEventListener("contextmenu", handleRightClick);

    return () => {
      allMessageContainer.removeEventListener("pointerdown", handlePointerDown);
      allMessageContainer.removeEventListener("pointerup", handlePointerUp);
      allMessageContainer.removeEventListener("pointercancel", handlePointerUp);
      allMessageContainer.removeEventListener("contextmenu", handleRightClick);
    };
  }, [divRef.current]);

  return {
    menu,
    handleEmojiPickerToggle,
    closeMenu,
    isEditing,
    toggleMessageEdit,
  };
}
