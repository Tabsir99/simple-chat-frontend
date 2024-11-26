interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode; 
  className?: string; 
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
