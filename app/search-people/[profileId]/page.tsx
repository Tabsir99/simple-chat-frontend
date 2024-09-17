import PrivateProfile from "@/components/profiles/privateProfile";
import UserPublicProfile from "@/components/profiles/publicprfoile";

export default function UserProfile() {
  const isPublic = false;

  return <>{isPublic ? <UserPublicProfile /> : <PrivateProfile />}</>;
}
