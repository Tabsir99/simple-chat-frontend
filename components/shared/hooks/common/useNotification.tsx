// hooks/useNotification.ts
import { NotificationProps, NotificationType } from "@/types/ChatTypes/CallTypes";
import { useState, useCallback } from "react";
import { v4 as uuid4 } from "uuid";


export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const showNotification = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      time: number = 5000
    ) => {
      const uuid = uuid4();
      setNotifications((prev) => [
        ...prev,
        {
          notificationId: uuid,
          message,
          type,
          time,
          onClose: (nid: string) =>
            setNotifications((prev) =>
              prev.filter((notification) => notification.notificationId !== nid)
            ),
        },
      ]);
    },
    []
  );

  return { notifications, showNotification };
};