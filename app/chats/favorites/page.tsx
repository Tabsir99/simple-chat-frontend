
import { Heart } from "lucide-react";

export default function FavoriteChats() {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-6xl gap-2 h-full text-gray-400">
        <Heart className="w-20 h-20" />
        <h2 className="text-2xl font-bold mb-2">Favorite Chats</h2>
        <p className="text-center text-base max-w-md">
          Select a chat from the sidebar to start messaging or create a new
          conversation.
        </p>
      </div>
    </>
  );
}
