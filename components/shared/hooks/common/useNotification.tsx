// hooks/useNotification.ts
import { useState, useCallback } from "react";
import { v4 as uuid4 } from "uuid";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationProps {
  notificationId: string;
  message?: string;
  type?: NotificationType;
  time?: number;
  onClose?: (nid: string) => void;
}

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