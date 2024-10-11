import ChatSidebar from "@/components/chats/chatSidebar";
import { ProtectedRoute } from "@/components/authComps/authcontext";
import SearchPeopleComp from "@/components/searchpeople/searchpeople";

export default function SearchPeople({ children }: {children: React.ReactNode}) {
  const people = [
    {
      id: 1,
      name: "John Doe",
      bio: "Software Engineer based in New York.",
      profilePicture: "/images/john.jpg", // Assuming you have profile pictures
    },
    {
      id: 2,
      name: "Jane Smith",
      bio: "Designer who loves minimalism.",
      profilePicture: "/images/jane.jpg",
    },
    {
      id: 3,
      name: "James Bond",
      bio: "Licensed to code.",
      profilePicture: "/images/james.jpg",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="h-full bg-[#1b1b1b] w-screen text-gray-100 flex">
        <ChatSidebar />
        <div className="people-list px-4 space-y-4 bg-[#1c222a] bg-opacity-90 w-96">
          <h1 className="text-2xl font-bold pt-3"> Search People </h1>
          <SearchPeopleComp />
        </div>
        <section className="bg-[#292f36] w-full">
          {children}
        </section>
      </div>
    </ProtectedRoute>
  );
}
