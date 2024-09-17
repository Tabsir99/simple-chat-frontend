import { MouseEventHandler } from "react";
import Close from "@mui/icons-material/Close";

export default function MediaModal({ toggleMediaModal }: { toggleMediaModal: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-[#1f2329] w-[95vw] h-[90vh] rounded-lg shadow-lg p-4 relative overflow-y-scroll">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            onClick={toggleMediaModal}
          >
            <Close className="w-6 h-6" />
          </button>
          <h2 className="text-white text-[24px] font-semibold mb-4">
            Shared Media & Documents
          </h2>
          {/* Grid of Media Files */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] items-start gap-4 overflow-y-auto h-full">
            {/* Sample media/document tiles */}
            <div className="bg-gray-700 p-4 rounded-md">
              <img
                src="/path-to-image/image1.jpg"
                alt="Image1"
                className="w-full h-auto object-cover rounded-md"
              />
              <p className="text-gray-400 mt-2 text-sm truncate">Image1.jpg</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <img
                src="/path-to-image/image2.png"
                alt="Image2"
                className="w-full h-auto object-cover rounded-md"
              />
              <p className="text-gray-400 mt-2 text-sm truncate">Image2.png</p>
            </div>
            {/* Add more media/document tiles dynamically */}
          </div>
        </div>
      </div>
    </>
  );
}
