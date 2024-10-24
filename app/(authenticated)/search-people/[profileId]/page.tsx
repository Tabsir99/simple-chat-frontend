import UserPublicProfile from "@/components/profiles/publicprfoile";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export default async function UserProfile({ params }: { params: Params }) {

  return <UserPublicProfile userId={params.profileId} />
}
