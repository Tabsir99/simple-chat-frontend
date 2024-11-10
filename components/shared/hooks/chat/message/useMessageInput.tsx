import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { useCommunication } from "@/components/shared/contexts/communication/communicationContext";
import { IChatHead } from "@/types/chatTypes";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useMessageInput = (fileInputRef: any) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useAuth();
  const { socket } = useCommunication();

  const chatRoomId = useParams().chatId;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? "Stopping recording" : "Starting recording");
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
    isRecording,
    setIsRecording,
    toggleRecording,
    handleFileChange,
    handleFileClick,
  };
};
