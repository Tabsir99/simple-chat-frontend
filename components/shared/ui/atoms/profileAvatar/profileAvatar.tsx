import Image from "next/image";
import Link from "next/link";

const Avatar = ({
  avatarName,
  profilePicture,
  className = "w-10 h-10 text-[18px] font-bold",
  href,
}: {
  avatarName: string;
  profilePicture: string | null;
  className?: string;
  href?: string;
}) => {
  const avatarContent = (
    <>
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
        <span className="flex justify-center items-center w-full h-full  rounded-full bg-gray-700 uppercase">
          {avatarName[0]}
        </span>
      )}
    </>
  );

  return href ? (
    <Link
      href={href}
      className={`flex justify-center items-center ${className}`}
    >
      {avatarContent}
    </Link>
  ) : (
    <div className={`flex justify-center items-center ${className}`}>
      {avatarContent}
    </div>
  );
};

export default Avatar;
