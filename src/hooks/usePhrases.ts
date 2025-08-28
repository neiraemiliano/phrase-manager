import { useCallback, useMemo } from "react";
import { useStore } from "@/store";
import { actions } from "@/store/actions";
import { selectFilteredAndSortedPhrases, selectStats } from "@/store/selectors";
import { Phrase, PhraseId } from "@/types";
import {
  createPhraseId,
  createISODateString,
  createPositiveNumber,
  createNonEmptyString,
} from "@/types/phrase.types";
import { generateId } from "@/utils";

export interface UsePlasesResult {
  // Data
  phrases: Phrase[];
  allPhrases: Phrase[];
  stats: ReturnType<typeof selectStats>;

  // Selection state
  selectedPhrases: PhraseId[];
  selectionMode: boolean;

  // Loading/Error state
  isLoading: boolean;
  error: string | null;

  // CRUD operations with stable IDs
  createPhrase: (phraseData: Omit<Phrase, "id" | "createdAt">) => void;
  updatePhrase: (id: PhraseId, updates: Partial<Phrase>) => void;
  deletePhrase: (id: PhraseId) => void;
  batchDelete: (ids: PhraseId[]) => void;
  importPhrases: (phrases: Phrase[]) => void;

  // Selection operations
  toggleSelectionMode: () => void;
  togglePhraseSelection: (id: PhraseId) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Utility functions
  findPhraseById: (id: PhraseId) => Phrase | undefined;
  duplicatePhrase: (id: PhraseId) => void;
  likePhrases: (id: PhraseId) => void;
}

/**
 * Headless hook for phrase CRUD operations with stable IDs and optimized updates
 * Provides all phrase management functionality without UI coupling
 */
export const usePhrases = (): UsePlasesResult => {
  const { state, dispatch } = useStore();

  // Memoized derived state - never duplicated
  const phrases = useMemo(() => selectFilteredAndSortedPhrases(state), [state]);

  const stats = useMemo(() => selectStats(state), [state]);

  // CRUD operations with stable callbacks
  const createPhrase = useCallback(
    (phraseData: Omit<Phrase, "id" | "createdAt">) => {
      const newPhrase: Phrase = {
        ...phraseData,
        id: createPhraseId(generateId()), // Stable ID generation
        createdAt: createISODateString(new Date().toISOString()),
        likes: createPositiveNumber(phraseData.likes || 0),
      };
      dispatch(actions.addPhrase(newPhrase));
    },
    [dispatch],
  );

  const updatePhrase = useCallback(
    (id: PhraseId, updates: Partial<Phrase>) => {
      // Prevent ID and createdAt changes for stability
      const safeUpdates = { ...updates };
      delete safeUpdates.id;
      delete safeUpdates.createdAt;

      dispatch(actions.updatePhrase(id, safeUpdates));
    },
    [dispatch],
  );

  const deletePhrase = useCallback(
    (id: PhraseId) => {
      dispatch(actions.deletePhrase(id));
    },
    [dispatch],
  );

  const batchDelete = useCallback(
    (ids: PhraseId[]) => {
      dispatch(actions.batchDelete(ids));
    },
    [dispatch],
  );

  const importPhrases = useCallback(
    (newPhrases: Phrase[]) => {
      // Ensure all imported phrases have stable IDs
      const phrasesWithIds = newPhrases.map((phrase) => ({
        ...phrase,
        id: phrase.id || createPhraseId(generateId()),
        createdAt:
          phrase.createdAt || createISODateString(new Date().toISOString()),
      }));
      dispatch(actions.importPhrases(phrasesWithIds));
    },
    [dispatch],
  );

  // Selection operations
  const toggleSelectionMode = useCallback(() => {
    dispatch(actions.toggleSelectionMode());
  }, [dispatch]);

  const togglePhraseSelection = useCallback(
    (id: PhraseId) => {
      dispatch(actions.togglePhraseSelection(id));
    },
    [dispatch],
  );

  const clearSelection = useCallback(() => {
    dispatch(actions.clearSelection());
  }, [dispatch]);

  const selectAll = useCallback(() => {
    // Select all currently visible/filtered phrases
    const visibleIds = phrases.map((p) => p.id);
    visibleIds.forEach((id) => {
      if (!state.selectedPhrases.includes(id)) {
        dispatch(actions.togglePhraseSelection(id));
      }
    });
  }, [dispatch, phrases, state.selectedPhrases]);

  // Utility functions
  const findPhraseById = useCallback(
    (id: PhraseId): Phrase | undefined => {
      return state.phrases.find((p) => p.id === id);
    },
    [state.phrases],
  );

  const duplicatePhrase = useCallback(
    (id: PhraseId) => {
      const originalPhrase = findPhraseById(id);
      if (originalPhrase) {
        createPhrase({
          ...originalPhrase,
          text: createNonEmptyString(`${originalPhrase.text} (copy)`),
          likes: createPositiveNumber(0), // Reset likes for duplicated phrase
        });
      }
    },
    [findPhraseById, createPhrase],
  );

  const likePhrases = useCallback(
    (id: PhraseId) => {
      const phrase = findPhraseById(id);
      if (phrase) {
        updatePhrase(id, {
          likes: createPositiveNumber((phrase.likes || 0) + 1),
        });
      }
    },
    [findPhraseById, updatePhrase],
  );

  return {
    // Data (derived, never duplicated)
    phrases,
    allPhrases: state.phrases,
    stats,

    // Selection state
    selectedPhrases: state.selectedPhrases,
    selectionMode: state.selectionMode,

    // Loading/Error state
    isLoading: state.isLoading,
    error: state.error,

    // CRUD operations
    createPhrase,
    updatePhrase,
    deletePhrase,
    batchDelete,
    importPhrases,

    // Selection operations
    toggleSelectionMode,
    togglePhraseSelection,
    clearSelection,
    selectAll,

    // Utilities
    findPhraseById,
    duplicatePhrase,
    likePhrases,
  };
};

/**
 * Specialized hook for bulk operations on large datasets
 * Optimized for performance with large phrase collections
 */
export const usePhraseBulkOperations = () => {
  const { batchDelete, selectedPhrases, clearSelection } = usePhrases();

  const deleteSelected = useCallback(() => {
    if (selectedPhrases.length > 0) {
      batchDelete(selectedPhrases);
      clearSelection();
    }
  }, [batchDelete, selectedPhrases, clearSelection]);

  const exportSelected = useCallback(() => {
    // Export functionality for selected phrases
    return selectedPhrases;
  }, [selectedPhrases]);

  return {
    deleteSelected,
    exportSelected,
    hasSelection: selectedPhrases.length > 0,
    selectionCount: selectedPhrases.length,
  };
};
