import ChatSidebar from "@/components/chats/chatSidebar";
import { Search } from "lucide-react"; // Update this to Material Icons or your preference
import Link from "next/link";

export default function SearchPeople({ children }: {children: React.ReactNode}) {
  const people = [
    {
      id: 1,
      name: "John Doe",
      bio: "Software Engineer based in New York.",
      location: "New York, USA",
      profilePicture: "/images/john.jpg", // Assuming you have profile pictures
    },
    {
      id: 2,
      name: "Jane Smith",
      bio: "Designer who loves minimalism.",
      location: "San Francisco, USA",
      profilePicture: "/images/jane.jpg",
    },
    {
      id: 3,
      name: "James Bond",
      bio: "Licensed to code.",
      location: "London, UK",
      profilePicture: "/images/james.jpg",
    },
  ];

  return (
    <>
      <div className="h-full bg-[#1b1b1b] w-screen text-gray-100 flex">
        <ChatSidebar />
        <div className="people-list px-4 space-y-4 bg-[#1c222a] bg-opacity-90 w-96">
          <h1 className="text-2xl font-bold pt-3"> Search People </h1>
          <div className="relative mb-6 bg-gray-700 bg-opacity-50 overflow-hidden rounded-md flex items-center px-3">
            <Search />
            <input
              type="text"
              placeholder="Search people..."
              className="w-full p-3 bg-transparent text-[18px] rounded-lg text-gray-300 placeholder-gray-400 outline-none"
            />
          </div>
          {people.map((person) => (
            <Link
              key={person.id}
              href={`/search-people/${person.id}`}
              className="flex items-center w-80 py-3 hover:cursor-pointer px-4 bg-[#252a32] rounded-lg transition-all duration-300 ease-in-out hover:bg-[#272e38]"
            >
              <div className="avatar w-12 h-12 bg-gray-700 rounded-full mr-4 flex justify-center items-center relative overflow-hidden">
                
                  {person.name.slice(0,2)}
                
              </div>
              <div className="flex-1 space-y-0.5">
                <h2 className="text-[18px] font-bold">{person.name}</h2>
                <p className="text-gray-400 text-[14px] truncate">
                  {person.bio.length > 40 ? person.bio.slice(0, 40) + "..." : person.bio}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <section className="bg-[#292f36] w-full">
          {children}
        </section>
      </div>
    </>
  );
}
