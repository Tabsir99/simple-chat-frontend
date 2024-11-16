export default function QuerySpinner({
  text = "Searching...",
}: {
  text?: string;
}) {
  return (
    <div className="text-center text-gray-400 py-8">
      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
      {text}
    </div>
  );
}
