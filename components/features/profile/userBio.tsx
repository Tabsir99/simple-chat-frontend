import { Edit } from "lucide-react";

export default function UserBio({
  isEditingBio,
  handleBioEdit,
  bio,
  handleBioChange,
}: {
  bio: string | undefined;
  handleBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isEditingBio: boolean;
  handleBioEdit: () => void;
}) {
  const displayOrDefault = (value: string | undefined, defaultText: string) =>
    value || defaultText;

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 min-h-[120px] relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Bio</h3>
          {!isEditingBio && (
            <button
              onClick={handleBioEdit}
              className="text-gray-200 hover:text-gray-400 flex items-center gap-1 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <textarea
          className={`w-full bg-gray-800 text-white rounded-lg p-3 outline-none border-2 border-gray-700 focus:border-blue-500 transition-all duration-200 min-h-[100px] resize-y ${
            isEditingBio
              ? "opacity-100"
              : "opacity-0 absolute pointer-events-none"
          }`}
          value={bio || ""}
          onChange={handleBioChange}
          placeholder="Tell us about yourself..."
        />
        <p className={`text-gray-300 ${isEditingBio ? "hidden" : "block"}`}>
          {displayOrDefault(
            bio,
            "This user hasn't added a bio yet. Click 'Edit' to add your bio!"
          )}
        </p>
      </div>
    </>
  );
}
