import { useState, useEffect } from 'react';

const CustomSpinner = ({ size = 40, color = '#3B82F6' }) => {
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

const defaultPhrases = [
  "Connecting to chat servers...",
  "Syncing your messages...",
  "Preparing your chatroom...",
  "Loading recent conversations...",
  "Checking for new messages..."
];

const FullPageLoader = ({ loadingPhrases=defaultPhrases, className=" fixed w-screen h-screen " }: { loadingPhrases?: String[] | null, className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setShowText(true);
    }, 1000);
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if(!loadingPhrases) return
    if (!showText) return;
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 15);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length);
        }, 500);
      }
    } else {
      const currentPhrase = loadingPhrases[currentPhraseIndex];
      if (displayText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 30);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 1500);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, currentPhraseIndex, isDeleting, showText]);

  return (
    <div className={" inset-0 flex items-center justify-center bg-gray-900 "+className}>
      <div className="text-center flex flex-col justify-center items-center">
        <CustomSpinner size={96} color="#3B82F6" />
        <div className="h-20 flex items-center justify-center">
          {loadingPhrases && showText && (
            <p className="mt-6 text-3xl font-bold text-gray-300">
              {displayText}
              <span className="animate-blink">|</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;