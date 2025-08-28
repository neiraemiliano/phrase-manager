import { useText } from "@/contexts/TextContext";
import { combineClasses } from "@/styles/design-system";
import { Check, X } from "lucide-react";
import React, { forwardRef } from "react";

type Props = {
  selectionMode: boolean;
  isSelected: boolean;
  handleDelete: (e: React.MouseEvent) => void;
};

export const PhraseCardSelection = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const { selectionMode, isSelected, handleDelete } = props;
    const { t } = useText();
    return (
      <React.Fragment>
        {selectionMode && (
          <div
            className={combineClasses(
              "absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              isSelected
                ? "bg-blue-500 border-blue-500"
                : "border-gray-400 dark:border-gray-600",
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        )}

        {!selectionMode && (
          <button
            ref={ref}
            onClick={handleDelete}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={t("common.deletePhrase")}
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        )}
      </React.Fragment>
    );
  },
);

PhraseCardSelection.displayName = "PhraseCardSelection";
