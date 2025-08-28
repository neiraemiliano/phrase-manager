import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";
import { PhraseViewGrid } from "@/components/phrases/PhraseView/PhraseViewGrid";
import { PhraseViewList } from "@/components/phrases/PhraseView/PhraseViewList";
import { PhraseViewVirtual } from "@/components/phrases/PhraseView/PhraseViewVirtual";
import { useStore } from "@/store";
import { selectFilteredAndSortedPhrases } from "@/store/selectors";
import { VIEW_MODES } from "@/utils";
import React, { useMemo, useDeferredValue } from "react";

const VIEW_COMPONENTS = {
  [VIEW_MODES.GRID]: PhraseViewGrid,
  [VIEW_MODES.LIST]: PhraseViewList,
  [VIEW_MODES.VIRTUAL]: PhraseViewVirtual,
} as const;

export const PhrasesSection: React.FC = () => {
  const { state } = useStore();

  // Use deferred value for large lists to keep UI responsive
  const deferredFilter = useDeferredValue(state.filter);
  const deferredSortBy = useDeferredValue(state.sortBy);
  const deferredSortOrder = useDeferredValue(state.sortOrder);

  const deferredState = useMemo(
    () => ({
      ...state,
      filter: deferredFilter,
      sortBy: deferredSortBy,
      sortOrder: deferredSortOrder,
    }),
    [state, deferredFilter, deferredSortBy, deferredSortOrder],
  );

  const filteredPhrases = useMemo(
    () => selectFilteredAndSortedPhrases(deferredState),
    [deferredState],
  );

  const isSearching =
    state.filter !== deferredFilter ||
    state.sortBy !== deferredSortBy ||
    state.sortOrder !== deferredSortOrder;

  if (state.isLoading) return <LoadingSpinner />;

  if (filteredPhrases.length === 0)
    return <EmptyState hasFilter={Boolean(state.filter)} />;

  const ViewComponent =
    VIEW_COMPONENTS[state.viewMode as keyof typeof VIEW_COMPONENTS];

  if (!ViewComponent) return <EmptyState hasFilter={false} />;

  return (
    <div className="relative">
      {isSearching && (
        <div className="absolute top-0 right-0 z-10 bg-blue-500 text-white px-2 py-1 rounded-bl-lg text-xs opacity-75">
          Searching...
        </div>
      )}
      <ViewComponent filteredPhrases={filteredPhrases} />
    </div>
  );
};

export default React.memo(PhrasesSection);
