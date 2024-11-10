import { Search } from "lucide-react";
import { ChangeEvent } from "react";

export default function SearchComp({
  onChange,
  title,
  placeHolder,
  className="min-w-full"
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  title: string
  placeHolder: string
  className?: string
}) {
  return (
    <div className="flex flex-col gap-4 pt-5">
      <h1 className="text-2xl font-bold capitalize max-lg:pl-16"> {title} </h1>
      <div className={`relative mb-0 bg-gray-700 bg-opacity-50 rounded-md flex items-center  ${className}`}>
        <Search className="absolute left-3" />
        <input
          type="text"
          placeholder={placeHolder}
          onChange={onChange}
          className="w-full focus:border-gray-600 border-transparent py-3 bg-transparent text-[18px] border-2 pl-10 pr-4 rounded-md text-gray-300 placeholder-gray-400 outline-none"
        />
      </div>
    </div>
  );
}
