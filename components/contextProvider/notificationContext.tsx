'use client'
import { createContext, useContext, useState, useCallback } from 'react';
import { NotificationProps }  from '../ui/notificationPopup';
import dynamic from 'next/dynamic';

const NotificationPopUp = dynamic(() => import("@/components/ui/notificationPopup"),{ ssr: false })

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationProps['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const showNotification = useCallback((message: string, type: NotificationProps['type'] = 'info') => {
    setNotification({ message, type, onClose: () => setNotification(null) });
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {<NotificationPopUp {...notification} />}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};