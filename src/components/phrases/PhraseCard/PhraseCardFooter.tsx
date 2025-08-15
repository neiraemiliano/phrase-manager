import { useText } from "@/contexts/TextContext";
import { useStore } from "@/store";
import { Phrase } from "@/types";
import { formatShortDate, VIEW_MODES } from "@/utils";
import clsx from "clsx";
import { Clock, Folder, Heart, Tag, User } from "lucide-react";
import React, { useMemo } from "react";

type Props = {
  phrase: Phrase;
  handleLike: (e: React.MouseEvent) => void;
};

const MAX_TAGS = 3;

export const PhraseCardFooter: React.FC<Props> = (props) => {
  const { phrase, handleLike } = props;
  const { tags = [] } = phrase;

  const { state } = useStore();
  const { t } = useText();

  const { visibleTags, hiddenCount } = useMemo(() => {
    const hiddenCount = Math.max(0, tags.length - MAX_TAGS);
    const visibleTags = tags.slice(0, MAX_TAGS);
    return { visibleTags, hiddenCount };
  }, [tags]);

  return (
    <div
      className={clsx(
        "mt-4 flex items-start justify-between gap-3",
        state.viewMode === VIEW_MODES.GRID ? "flex-col" : "flex-row"
      )}
    >
      <div
        className={clsx(
          "flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500 dark:text-gray-400 ",
          state.viewMode === VIEW_MODES.GRID && "w-full justify-between"
        )}
      >
        {phrase.category && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            <Folder className="w-3 h-3" />
            {t(`phrases.categories.${phrase.category}`)}
          </span>
        )}
        {phrase.author && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {phrase.author}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatShortDate(phrase.createdAt)}
        </span>
      </div>

      <div
        className={clsx(
          "flex flex-wrap items-center gap-2 justify-end",
          state.viewMode === VIEW_MODES.GRID && "w-full justify-between"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {visibleTags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              +{hiddenCount}
            </span>
          )}
        </div>

        <button
          onClick={handleLike}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-pressed={!!(phrase.likes && phrase.likes > 0)}
        >
          <Heart
            className={clsx(
              "w-3 h-3",
              phrase.likes && phrase.likes > 0
                ? "fill-red-500 text-red-500"
                : ""
            )}
          />
          <span>{phrase.likes || 0}</span>
        </button>
      </div>
    </div>
  );
};
