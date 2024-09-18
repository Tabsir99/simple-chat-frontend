import ChatSidebar from "@/components/chats/chatSidebar";
import PrivateProfile from "@/components/profiles/privateProfile";

export default function PrivateProfilePage() {
  return (
    <div className="flex justify-stretch">
      <ChatSidebar />
      <PrivateProfile />
    </div>
  );
}
