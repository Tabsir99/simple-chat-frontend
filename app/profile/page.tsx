import ChatSidebar from "@/components/chats/chatSidebar";
import PrivateProfile from "@/components/profiles/privateProfile";
import { ProtectedRoute } from "@/components/authComps/authcontext";

export default function PrivateProfilePage() {
  return (
  <ProtectedRoute>
    <div className="flex justify-stretch">
      <ChatSidebar />
      <PrivateProfile />
    </div>
    </ProtectedRoute>
  );
}
