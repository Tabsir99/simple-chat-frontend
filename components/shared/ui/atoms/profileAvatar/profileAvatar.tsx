import Image from "next/image";


const ProfilePicture = ({
    senderName,
    profilePicture,
  }: {
    senderName: string;
    profilePicture?: string;
  }) => {
    return profilePicture ? (
      <div className="w-8 h-8 flex-shrink-0 -mt-2">
        <Image
          src={profilePicture}
          alt={senderName}
          width={40}
          height={40}
          className="rounded-full w-full h-full object-cover"
        />
      </div>
    ) : (
      <span className="flex-shrink-0 flex justify-center items-center w-8 h-8 text-[14px] font-bold rounded-full bg-gray-700 uppercase -mt-2">
        {senderName.slice(0, 2)}
      </span>
    );
  };
  