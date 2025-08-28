import { useText } from "@/contexts/TextContext";
import { useStore } from "@/store";
import { Phrase } from "@/types";
import { formatShortDate, VIEW_MODES } from "@/utils";
import { combineClasses, utils } from "@/styles/design-system";
import { Clock, Folder, Heart, Tag, User } from "lucide-react";
import React, { useMemo } from "react";

type Props = {
  phrase: Phrase;
  handleLike: (e: React.MouseEvent) => void;
};

const MAX_TAGS_DESKTOP = 3;
const MAX_TAGS_MOBILE = 2; // Show fewer tags on mobile

export const PhraseCardFooter: React.FC<Props> = (props) => {
  const { phrase, handleLike } = props;
  const { tags = [] } = phrase;

  const { state } = useStore();
  const { t } = useText();

  const {
    visibleTagsDesktop,
    visibleTagsMobile,
    hiddenCountDesktop,
    hiddenCountMobile,
  } = useMemo(() => {
    // Desktop tags
    const hiddenCountDesktop = Math.max(0, tags.length - MAX_TAGS_DESKTOP);
    const visibleTagsDesktop = tags.slice(0, MAX_TAGS_DESKTOP);

    // Mobile tags
    const hiddenCountMobile = Math.max(0, tags.length - MAX_TAGS_MOBILE);
    const visibleTagsMobile = tags.slice(0, MAX_TAGS_MOBILE);

    return {
      visibleTagsDesktop,
      visibleTagsMobile,
      hiddenCountDesktop,
      hiddenCountMobile,
    };
  }, [tags]);

  return (
    <div
      className={combineClasses(
        "mt-2 sm:mt-4", // Reduced margin on mobile
        "flex items-start justify-between gap-2 sm:gap-3",
        state.viewMode === VIEW_MODES.GRID ? "flex-col" : "flex-row",
      )}
    >
      <div
        className={combineClasses(
          "flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-2",
          "text-xs text-gray-500 dark:text-gray-400",
          state.viewMode === VIEW_MODES.GRID && "w-full justify-between",
        )}
      >
        {phrase.category && (
          <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            <Folder className="w-3 h-3" />
            <span className="hidden sm:inline">
              {t(`phrases.categories.${phrase.category}`)}
            </span>
          </span>
        )}
        {phrase.author && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span
              className={combineClasses(
                utils.text.truncate,
                "max-w-[60px] sm:max-w-none",
              )}
            >
              {phrase.author}
            </span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{formatShortDate(phrase.createdAt)}</span>
        </span>
      </div>

      <div
        className={combineClasses(
          "flex flex-wrap items-center gap-1 sm:gap-2 justify-end",
          state.viewMode === VIEW_MODES.GRID && "w-full justify-between",
        )}
      >
        <div
          className={combineClasses(
            "flex flex-wrap items-center gap-1 sm:hidden",
          )}
        >
          {visibleTagsMobile.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              <Tag className="w-2.5 h-2.5" />
              <span
                className={combineClasses(utils.text.truncate, "max-w-[40px]")}
              >
                {tag}
              </span>
            </span>
          ))}
          {hiddenCountMobile > 0 && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              +{hiddenCountMobile}
            </span>
          )}
        </div>

        <div
          className={combineClasses(
            "hidden sm:flex flex-wrap items-center gap-2",
          )}
        >
          {visibleTagsDesktop.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {hiddenCountDesktop > 0 && (
            <span className="px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              +{hiddenCountDesktop}
            </span>
          )}
        </div>

        <button
          onClick={handleLike}
          className={combineClasses(
            "flex items-center gap-1",
            "px-2 py-1 sm:px-2 sm:py-1 rounded-md text-xs",
            "transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
            utils.responsive.touchTarget,
            "min-w-[40px] justify-center",
          )}
          aria-pressed={!!(phrase.likes && phrase.likes > 0)}
        >
          <Heart
            className={combineClasses(
              "w-3 h-3",
              phrase.likes && phrase.likes > 0
                ? "fill-red-500 text-red-500"
                : "",
            )}
          />
          <span>{phrase.likes || 0}</span>
        </button>
      </div>
    </div>
  );
};
