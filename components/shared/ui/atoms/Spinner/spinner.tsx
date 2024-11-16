const CustomSpinner = ({ size = 40, color = "#3B82F6" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      className="animate-spin-smooth"
    >
      <style>
        {`
            @keyframes smoothSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-spin-smooth {
              animation: smoothSpin 1s linear infinite;
            }
          `}
      </style>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18" />
        </g>
      </g>
    </svg>
  );
};

export default CustomSpinner;
