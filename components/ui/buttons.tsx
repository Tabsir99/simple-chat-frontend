interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode; // Changed to React.ReactNode
  className?: string; // Made className optional
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  className = "",
  ...btnprops
}) => {
  return (
    <button
      className={`
                relative text-white
                overflow-hidden transition-all duration-300 ease-in-out
                focus:outline-none 
                disabled:opacity-60 disabled:cursor-not-allowed
                ${className}
            `}
      disabled={isLoading}
      {...btnprops}
    >
      <span
        className={`relative z-10 flex justify-center items-center ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-white rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </button>
  );
};

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger" | "success" | "ghost" | "outline";
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm";
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "default",
  children,
  size = "default",
  className,
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
    success: "bg-emerald-600 text-white hover:bg-emerald-700 border border-transparent",
    ghost: "bg-transparent hover:bg-white/10 text-white border border-transparent",
    outline:
      "bg-transparent border border-slate-700 text-white hover:bg-white/5",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
