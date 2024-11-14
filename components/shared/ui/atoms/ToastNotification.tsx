import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ToastNotification = ({
  message,
  type = 'success',
  duration = 50000,
  handleClose
}: {
  message: string;
  handleClose: () => void
  type?: 'success' | 'error';
  duration?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      handleClose()
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, type]);

  return (
    <div
      className={`absolute top-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-md z-50 shadow-lg transition-all duration-300 flex items-center gap-3 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="text-green-500" size={20} />
      ) : (
        <XCircle className="text-red-500" size={20} />
      )}
      <p className="flex-1 font-medium">{message}</p>
      <button
        className="text-gray-400 hover:text-gray-200 transition-colors"
        onClick={() => handleClose()}
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};

export default ToastNotification;