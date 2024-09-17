
import { GrEmptyCircle } from "react-icons/gr";

export default function SearchPeoplePlaceHolder() {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-6xl gap-2 h-full text-gray-400">
        <GrEmptyCircle className="w-20 h-20" />
        <h2 className="text-2xl font-bold mb-2">Search People</h2>
        <p className="text-center text-base max-w-md">
          Click on a profile from the sidebar to view the profile
        </p>
      </div>
    </>
  );
}
