import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";
import { toast } from "@/components/common/Toast/Toast";
import { useText } from "@/contexts/TextContext";
import { actions, useStore } from "@/store";
import {
  animations,
  cards,
  colors,
  combineClasses,
  utils,
} from "@/styles/design-system";
import { Phrase } from "@/types";
import { createPositiveNumber } from "@/types/phrase.types";
import React, {
  memo,
  useCallback,
  useRef,
  useState,
  useTransition,
} from "react";
import { PhraseCardFooter } from "./PhraseCardFooter";
import { PhraseCardSelection } from "./PhraseCardSelection";

interface PhraseCardProps {
  phrase: Phrase;
  isSelected?: boolean;
}

export const PhraseCard = memo<PhraseCardProps>(
  ({ phrase, isSelected = false }) => {
    const { t } = useText();
    const { state, dispatch } = useStore();
    const [isPending, startTransition] = useTransition();

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const deleteButtonRef = useRef<HTMLButtonElement>(null);

    const handleDeleteClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteConfirm(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      setIsDeleting(true);
      setShowDeleteConfirm(false);

      setTimeout(() => {
        startTransition(() => {
          dispatch(actions.deletePhrase(phrase.id));
        });
        toast.info(t("messages.phraseDeleted"));
      }, 300);
    }, [phrase.id, dispatch, t]);

    const handleCancelDelete = useCallback(() => {
      setShowDeleteConfirm(false);
      // Return focus to the delete button
      setTimeout(() => {
        deleteButtonRef.current?.focus();
      }, 100);
    }, []);

    const handleSelect = useCallback(() => {
      if (state.selectionMode)
        startTransition(() => {
          dispatch(actions.togglePhraseSelection(phrase.id));
        });
    }, [state.selectionMode, phrase.id]);

    const handleLike = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        let phrase2 = state.phrases.find((p: Phrase) => p.id === phrase.id);
        if (phrase2) {
          dispatch(
            actions.updatePhrase(phrase2.id, {
              likes: createPositiveNumber((phrase2.likes || 0) + 1),
            }),
          );
        }
      },
      [phrase.id, dispatch, t],
    );

    const highlightText = (text: string, term?: string) => {
      if (!term) return text;
      const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(`(${safe})`, "ig");
      return text.split(rx).map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      );
    };

    if (isPending) return <LoadingSpinner />;

    return (
      <div
        onClick={handleSelect}
        role={state.selectionMode ? "button" : undefined}
        className={combineClasses(
          cards.base,
          "p-3 sm:p-4 md:p-6",
          cards.shadows.md,
          "relative group h-full flex flex-col",
          "min-h-[160px] sm:min-h-[180px]",
          "max-h-[240px] sm:max-h-[280px]",
          cards.interactive,
          animations.transition.normal,
          "hover:ring-1 hover:ring-purple-500/30",
          utils.responsive.touchTarget,
          isSelected && cards.selected,
          state.selectionMode && "cursor-pointer",
          isDeleting && "opacity-50 scale-95",
        )}
      >
        <PhraseCardSelection
          selectionMode={state.selectionMode}
          isSelected={isSelected}
          handleDelete={handleDeleteClick}
          ref={deleteButtonRef}
        />

        <p
          className={combineClasses(
            "text-sm sm:text-base",
            "leading-relaxed",
            colors.text.primary,
            "mb-3 sm:mb-4 flex-1 overflow-hidden",
            "line-clamp-2 sm:line-clamp-3",
            utils.text.wrap,
          )}
        >
          {highlightText(phrase.text, state.filter)}
        </p>

        <PhraseCardFooter phrase={phrase} handleLike={handleLike} />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={t("confirm.delete.title")}
          message={t("confirm.delete.message", {
            text:
              phrase.text.slice(0, 50) + (phrase.text.length > 50 ? "..." : ""),
          })}
          confirmText={t("confirm.delete.confirm")}
          cancelText={t("confirm.delete.cancel")}
          variant="danger"
        />
      </div>
    );
  },
);

PhraseCard.displayName = "PhraseCard";
