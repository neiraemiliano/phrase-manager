import { Phrase } from "@/types";
import clsx from "clsx";
import React, { memo, useCallback, useState, useTransition } from "react";
import { PhraseCardFooter } from "./PhraseCardFooter";
import { PhraseCardSelection } from "./PhraseCardSelection";
import { actions, useStore } from "@/store";
import { toast } from "@/components/common/Toast/Toast";
import { useText } from "@/contexts/TextContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";

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

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
        setTimeout(() => {
          startTransition(() => {
            dispatch(actions.deletePhrase(phrase.id));
          });
          toast.info(t("messages.phraseDeleted"));
        }, 300);
      },
      [phrase.id, dispatch, t]
    );

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
              likes: (phrase2.likes || 0) + 1,
            })
          );
        }
      },
      [phrase.id, dispatch, t]
    );

    const highlightText = (text: string, term?: string) => {
      if (!term) return text;
      const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(`(${safe})`, "ig");
      return text.split(rx).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-yellow-400 text-gray-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    };

    if (isPending) return <LoadingSpinner />;

    return (
      <div
        onClick={handleSelect}
        role={state.selectionMode ? "button" : undefined}
        className={clsx(
          "relative group p-6 rounded-xl border-2 transition-[box-shadow,transform] duration-200",
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 justify-between",
          "border-gray-200 dark:border-gray-700",
          "hover:shadow-xl focus-within:shadow-xl hover:ring-1 hover:ring-blue-500/30",
          "h-full flex flex-col overflow-hidden",

          {
            "ring-2 ring-blue-500": isSelected,
            "cursor-pointer": state.selectionMode,
            "opacity-50 scale-95": isDeleting,
          }
        )}
      >
        <PhraseCardSelection
          selectionMode={state.selectionMode}
          isSelected={isSelected}
          handleDelete={handleDelete}
        />

        <p
          className={clsx(
            "text-lg text-gray-800 dark:text-gray-100 leading-relaxed",
            "line-clamp-4"
          )}
        >
          {highlightText(phrase.text, state.filter)}
        </p>

        <PhraseCardFooter phrase={phrase} handleLike={handleLike} />
      </div>
    );
  }
);

PhraseCard.displayName = "PhraseCard";
