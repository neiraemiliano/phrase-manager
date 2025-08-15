import clsx from "clsx";
import { Check, X } from "lucide-react";
import React from "react";

type Props = {
  selectionMode: boolean;
  isSelected: boolean;
  handleDelete: (e: React.MouseEvent) => void;
};

export const PhraseCardSelection: React.FC<Props> = (props) => {
  const { selectionMode, isSelected, handleDelete } = props;
  return (
    <React.Fragment>
      {selectionMode && (
        <div
          className={clsx(
            "absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
            isSelected
              ? "bg-blue-500 border-blue-500"
              : "border-gray-400 dark:border-gray-600"
          )}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
      )}

      {!selectionMode && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
          aria-label="Delete phrase"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>
      )}
    </React.Fragment>
  );
};
