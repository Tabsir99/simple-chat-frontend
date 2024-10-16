import { CustomButton } from "./buttons";

const ConfirmationModal = ({
    isOpen,
    onClose,
    title,
    children,
    onConfirm
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onConfirm: () => void
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-slate-900 rounded-lg w-full max-w-md p-6 border border-slate-800">
          <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
          <div className="text-slate-300 mb-6">{children}</div>
          <div className="flex justify-end space-x-3">
          <CustomButton
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="danger"
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              Block User
            </CustomButton>
          </div>
        </div>
      </div>
    );
  };

export default ConfirmationModal;