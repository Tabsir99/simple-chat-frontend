import { useState, useEffect } from "react";
import CustomSpinner from "../atoms/Spinner/spinner";

const defaultPhrases = [
  "Connecting to chat servers...",
  "Syncing your messages...",
  "Preparing your chatroom...",
  "Loading recent conversations...",
  "Checking for new messages...",
];

const FullPageLoader = ({
  loadingPhrases = defaultPhrases,
  className = " fixed ",
  height = "100dvh",
  width = "100vw",
  spinnerSize = 96,
}: {
  loadingPhrases?: String[] | null;
  className?: string;
  width?: string;
  height?: string;
  spinnerSize?: number;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    console.log("It ran");
    const initialDelay = setTimeout(() => {
      console.log("TImer run");
      setShowText(true);
    }, 1000);
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!loadingPhrases) return;
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
          setCurrentPhraseIndex(
            (prevIndex) => (prevIndex + 1) % loadingPhrases.length
          );
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
    <div
      className={" inset-0 " + className}
      style={{
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827",
      }}
    >
      <div className="text-center flex flex-col justify-center items-center">
        <CustomSpinner size={spinnerSize} color="#3B82F6" />
        {loadingPhrases && showText && (
          <div className="h-20 flex items-center justify-center">
            <p className="mt-6 text-3xl font-bold text-gray-300">
              {displayText}
              <span className="animate-blink">|</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullPageLoader;
