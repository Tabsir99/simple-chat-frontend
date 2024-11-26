import UserPublicProfile from "@/components/features/profile/publicprfoile";

export default async function UserProfile({ params }: { params: any }) {
  return <UserPublicProfile userId={params.profileId} />;
}
