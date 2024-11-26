import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useMessageInput = (fileInputRef: any) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { socket } = useCommunication();

  const chatRoomId = useParams().chatId;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (newMessage.length > 0 && !isTyping) {
      setIsTyping(true);
      if (socket) {
        socket.emit("user:typing", {
          username: user?.username,
          userId: user?.userId,
          profilePicture: user?.profilePicture,
          isStarting: true,
          chatRoomId: chatRoomId,
        });
      }
    }
    if (newMessage.length === 0 && isTyping) {
      setIsTyping(false);
      if (socket) {
        socket.emit("user:typing", {
          username: user?.username,
          profilePicture: user?.profilePicture,
          userId: user?.userId,
          isStarting: false,
          chatRoomId: chatRoomId,
        });
      }
    }
  }, [newMessage, isTyping, socket, user]);

  return {
    newMessage,
    setNewMessage,
    handleFileClick,
  };
};
