import { useEffect, useState } from "react";
import { CustomButton } from "../../atoms/Button/customButton";

const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmBtnText = "Block User",
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  className?: string;
  confirmBtnText?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed flex items-center justify-center z-[99] w-screen right-0 top-0 h-[100dvh] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative bg-slate-900 rounded-lg w-full max-w-md p-6 border border-slate-800
          transition-all duration-300 transform
          ${isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        `}
      >
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div className="text-slate-300 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <CustomButton variant="ghost" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmBtnText}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;