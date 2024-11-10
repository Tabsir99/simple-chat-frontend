export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger" | "success" | "ghost" | "outline";
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm";
  loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "default",
  children,
  size = "default",
  className,
  loading,
  ...props
}) => {
  const baseStyles =
    "rounded-md font-medium transition-all duration-200 flex items-center justify-center";
  const sizeStyles = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
  };
  const variantStyles = {
    default:
      "bg-white text-slate-900 hover:bg-slate-100 border border-transparent",
    danger: "bg-red-500 text-white hover:bg-red-600 border border-transparent",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 border border-transparent",
    ghost:
      "bg-transparent hover:bg-white/10 text-white border border-transparent",
    outline:
      "bg-transparent border border-slate-700 text-white hover:bg-white/5",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}

      {loading && (
        <svg
          className="animate-spin h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </button>
  );
};
