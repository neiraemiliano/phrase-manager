import { useText } from "@contexts/TextContext";
import { actions, useStore } from "@/store";
import { Hash, Search, X } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  hasFilter?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilter = false,
}) => {
  const { t } = useText();
  const { dispatch } = useStore();

  const Icon = hasFilter ? Search : Hash;

  const handleClearFilter = () => {
    dispatch(actions.setFilter(""));
  };

  return (
    <div
      className="text-center py-16"
      role="region"
      aria-label={hasFilter ? "No search results" : "Empty phrase list"}
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Icon
          className="w-10 h-10 text-gray-400 dark:text-gray-600"
          aria-hidden="true"
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {hasFilter ? t("phrases.empty.filtered") : t("phrases.empty.title")}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {hasFilter
          ? t("phrases.empty.filteredSubtitle")
          : t("phrases.empty.subtitle")}
      </p>

      {hasFilter && (
        <button
          onClick={handleClearFilter}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-label={t("common.clearSearchFilter")}
        >
          <X className="w-4 h-4 mr-2" aria-hidden="true" />
          {t("search.clear")}
        </button>
      )}
    </div>
  );
};
