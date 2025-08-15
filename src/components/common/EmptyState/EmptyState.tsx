import { useText } from "@contexts/TextContext";
import { Hash, Search } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  hasFilter?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilter = false,
}) => {
  const { t } = useText();

  const Icon = hasFilter ? Search : Hash;

  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Icon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {hasFilter ? t("phrases.empty.filtered") : t("phrases.empty.title")}
      </h3>

      {!hasFilter && (
        <>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t("phrases.empty.subtitle")}
          </p>
        </>
      )}
    </div>
  );
};
