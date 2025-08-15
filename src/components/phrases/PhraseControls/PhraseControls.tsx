import { useText } from "@/contexts/TextContext";
import { actions, useStore } from "@/store";
import { SORT_OPTIONS, SORT_ORDERS } from "@utils/constants";
import clsx from "clsx";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

export const PhraseControls: React.FC = () => {
  const { state, dispatch } = useStore();
  const { t } = useText();

  const sortsOptions = {
    [SORT_OPTIONS.DATE]: t("sort.options.date"),
    [SORT_OPTIONS.TEXT]: t("sort.options.text"),
    [SORT_OPTIONS.LIKES]: t("sort.options.likes"),
    [SORT_OPTIONS.AUTHOR]: t("sort.options.author"),
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(actions.setSort(e.target.value as any, state.sortOrder));
  };

  const toggleSortOrder = () => {
    dispatch(
      actions.setSort(
        state.sortBy,
        state.sortOrder === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC
      )
    );
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <select
        value={state.sortBy}
        onChange={handleSortChange}
        className={clsx(
          "px-3 py-2 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "border-gray-300 dark:border-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500"
        )}
      >
        {Object.entries(sortsOptions).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button
        onClick={toggleSortOrder}
        className={clsx(
          "p-2 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "border-gray-300 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-700"
        )}
        title={
          state.sortOrder === SORT_ORDERS.ASC
            ? t("sort.order.asc")
            : t("sort.order.desc")
        }
      >
        {state.sortOrder === SORT_ORDERS.ASC ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
