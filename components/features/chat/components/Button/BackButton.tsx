import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className=" flex items-center justify-center w-5 h-5 rounded-full border-gray-700/50 bg-[#232b36]/50 hover:bg-[#2c3745]/80
                          backdrop-blur-sm transition-all duration-200 ease-out
                          active:scale-95
                          hover:border-gray-600"
      aria-label="Go back"
      onClick={() => {
        router.push("/chats");
      }}
    >
      <ArrowLeft
        className="
                      w-5 h-5 
                      scale-x-125
                      text-gray-400 
                      transition-all duration-200 ease-out"
      />
    </button>
  );
}
