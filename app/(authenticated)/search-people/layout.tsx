import ChatSidebar from "@/components/chats/chatSidebar";
import SearchPeopleComp from "@/components/searchpeople/searchpeople";

export default function SearchPeople({ children }: {children: React.ReactNode}) {
  
  return (
    <>
      <div className="h-full bg-[#1b1b1b] w-screen text-gray-100 flex">
        <ChatSidebar />
        <div className="people-list px-4 space-y-4 bg-[#1a222d] bg-opacity-90 w-96 py-3">
          <h1 className="text-2xl font-bold pt-3"> Search People </h1>
          <SearchPeopleComp />
        </div>
        <section className="bg-[#292f36] w-full">
          {children}
        </section>
      </div>
    </>
  );
}
