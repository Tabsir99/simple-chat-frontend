import type { Attachment } from "@/types/chatTypes";

interface AttachmentsProps {
  attachments: Attachment[];
}

const Attachments = ({ attachments }: AttachmentsProps) => {
  return (
    // <div className="mt-2 space-y-2">
    //   {attachments.map((attachment, index) => (
    //     <div key={index} className="rounded overflow-hidden">
    //       {attachment.type === "image" && (
    //         <img
    //           src={attachment.url}
    //           alt="attachment"
    //           className="max-w-full h-auto"
    //         />
    //       )}
    //       {attachment.type === "document" && (
    //         <a
    //           href={attachment.url}
    //           className="flex items-center gap-2 bg-gray-700 p-2 rounded"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           <span>{attachment.url}</span>
    //           <span className="text-sm text-gray-400">
    //             ({""}KB)
    //           </span>
    //         </a>
    //       )}
    //     </div>
    //   ))}
    // </div>
    <></>
  );
};

export default Attachments;
