import { useText } from "@/contexts/TextContext";
import { useStore } from "@/store";
import { ViewMode } from "@/types";
import { VIEW_MODES } from "@/utils";
import clsx from "clsx";
import { Grid, Layers, List } from "lucide-react";
import React from "react";

type Props = {
  handle: (viewMode: ViewMode) => void;
};

export const HeaderViewModeSelector: React.FC<Props> = (props) => {
  const { handle } = props;
  const { state } = useStore();
  const { t } = useText();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => handle(VIEW_MODES.GRID)}
        className={clsx(
          "p-2 rounded transition-colors",
          state.viewMode === VIEW_MODES.GRID
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        title={t("header.viewMode.grid")}
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => handle(VIEW_MODES.LIST)}
        className={clsx(
          "p-2 rounded transition-colors",
          state.viewMode === VIEW_MODES.LIST
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        title={t("header.viewMode.list")}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => handle(VIEW_MODES.VIRTUAL)}
        className={clsx(
          "p-2 rounded transition-colors",
          state.viewMode === VIEW_MODES.VIRTUAL
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        title={t("header.viewMode.virtual")}
      >
        <Layers className="w-4 h-4" />
      </button>
    </div>
  );
};
