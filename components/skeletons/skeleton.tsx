export function MiniProfileSkeleton({ width="w-80" }: {width?: string}) {
  return (
    <div className={`flex items-center  py-3 px-4 bg-[#252a32] rounded-lg ${width}`}>
      <div className="w-12 h-12 bg-gray-700 rounded-full mr-4 overflow-hidden">
        <div className="w-full h-full bg-shimmer bg-200% animate-shimmer"></div>
      </div>
      <div className="flex-1 space-y-1">
        <div className="h-5 w-32 bg-gray-600 rounded-md bg-shimmer bg-200% animate-shimmer"></div>
        <div className="h-4 w-48 bg-gray-600 rounded-md bg-shimmer bg-200% animate-shimmer"></div>
      </div>
    </div>
  );
}
