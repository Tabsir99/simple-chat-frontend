import React from "react";
import { Users, AlertCircle, SearchX } from "lucide-react";

const SearchResultMessage = ({
  showMessage,
  query,
}: {
  showMessage: { default: boolean; warning: boolean; notFound: boolean };
  query: string;
}) => {
  const messageConfig = {
    default: {
      icon: <Users className="mx-auto mb-4 text-blue-400" size={48} />,
      title: "Discover People",
      description: "Start typing to find interesting people in the community",
    },
    warning: {
      icon: <AlertCircle className="mx-auto mb-4 text-yellow-400" size={48} />,
      title: "Keep Typing",
      description: "Please enter at least 2 characters to start searching.",
    },
    notFound: {
      icon: <SearchX className="mx-auto mb-4 text-red-400" size={48} />,
      title: "No Results Found",
      description: `We couldn't find anyone matching "${query}". Try a different search term.`,
    },
  };

  const activeMessage = showMessage.default
    ? messageConfig.default
    : showMessage.warning
    ? messageConfig.warning
    : showMessage.notFound
    ? messageConfig.notFound
    : null;

  return activeMessage ? (
    <div className="text-center p-6 bg-gray-800 bg-opacity-70 rounded-lg w-full shadow-lg">
      {activeMessage.icon}
      <h3 className="text-xl font-semibold text-gray-200 mb-2">
        {activeMessage.title}
      </h3>
      <p className="text-gray-400">{activeMessage.description}</p>
    </div>
  ) : null;
};

export default SearchResultMessage;
