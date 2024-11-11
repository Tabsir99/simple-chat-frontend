import Image from "next/image";
import Link from "next/link";

const Avatar = ({
  avatarName,
  profilePicture,
  href = "#",
}: {
  avatarName: string;
  profilePicture: string | null;
  href?: string;
}) => {
  return (
    <Link href={href} className="w-10 h-10 flex justify-center items-center">
      {profilePicture ? (
        <div className="w-full h-full">
          <Image
            src={profilePicture}
            alt={avatarName}
            width={40}
            height={40}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
      ) : (
        <span className=" flex justify-center items-center w-full h-full text-[18px] font-bold rounded-full bg-gray-700 uppercase">
          {avatarName[0]}
        </span>
      )}
    </Link>
  );
};

export default Avatar;
