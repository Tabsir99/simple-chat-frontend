"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

const notificationTypes = {
  success: {
    bgColor: "bg-emerald-900",
    iconColor: "text-emerald-400",
    icon: CheckCircle,
  },
  error: {
    bgColor: "bg-rose-900",
    iconColor: "text-rose-400",
    icon: XCircle,
  },
  warning: {
    bgColor: "bg-amber-900",
    iconColor: "text-amber-400",
    icon: AlertCircle,
  },
  info: { bgColor: "bg-sky-900", iconColor: "text-sky-400", icon: Info },
};

export interface NotificationProps {
  message?: string;
  type?: NotificationType;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const { bgColor, iconColor, icon: Icon } = notificationTypes[type || "info"];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!onClose) return;
    setIsVisible(true);
    let innerTimer: NodeJS.Timeout;
    const timer = setTimeout(() => {
      setIsVisible(false);
      innerTimer = setTimeout(onClose, 500);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(innerTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed z-[9999] top-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
        <span className="font-medium">{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
