import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";
import { PhraseViewGrid } from "@/components/phrases/PhraseView/PhraseViewGrid";
import { PhraseViewList } from "@/components/phrases/PhraseView/PhraseViewList";
import { PhraseViewVirtual } from "@/components/phrases/PhraseView/PhraseViewVirtual";
import { useStore } from "@/store";
import { selectFilteredAndSortedPhrases } from "@/store/selectors";
import { VIEW_MODES } from "@/utils";
import React, { useMemo } from "react";

const VIEW_COMPONENTS = {
  [VIEW_MODES.GRID]: PhraseViewGrid,
  [VIEW_MODES.LIST]: PhraseViewList,
  [VIEW_MODES.VIRTUAL]: PhraseViewVirtual,
} as const;

export const PhrasesSection: React.FC = () => {
  const { state } = useStore();

  const filteredPhrases = useMemo(
    () => selectFilteredAndSortedPhrases(state),
    [state]
  );

  if (state.isLoading) return <LoadingSpinner />;

  if (filteredPhrases.length === 0)
    return <EmptyState hasFilter={Boolean(state.filter)} />;

  const ViewComponent =
    VIEW_COMPONENTS[state.viewMode as keyof typeof VIEW_COMPONENTS];

  if (!ViewComponent) return <EmptyState hasFilter={false} />;

  return (
    <div className="relative">
      <ViewComponent filteredPhrases={filteredPhrases} />
    </div>
  );
};

export default React.memo(PhrasesSection);
