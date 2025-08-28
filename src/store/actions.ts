import { Phrase, SortBy, SortOrder, ViewMode, Action, PhraseId } from "@/types";

export const actions = {
  addPhrase: (phrase: Phrase): Action => ({
    type: "ADD_PHRASE",
    payload: phrase,
  }),

  deletePhrase: (id: PhraseId): Action => ({
    type: "DELETE_PHRASE",
    payload: id,
  }),

  batchDelete: (ids: PhraseId[]): Action => ({
    type: "BATCH_DELETE",
    payload: ids,
  }),

  updatePhrase: (id: PhraseId, updates: Partial<Phrase>): Action => ({
    type: "UPDATE_PHRASE",
    payload: { id, updates },
  }),

  setFilter: (filter: string): Action => ({
    type: "SET_FILTER",
    payload: filter,
  }),

  setSort: (sortBy: SortBy, sortOrder: SortOrder): Action => ({
    type: "SET_SORT",
    payload: { sortBy, sortOrder },
  }),

  toggleSelectionMode: (): Action => ({
    type: "TOGGLE_SELECTION_MODE",
  }),

  togglePhraseSelection: (id: PhraseId): Action => ({
    type: "TOGGLE_PHRASE_SELECTION",
    payload: id,
  }),

  clearSelection: (): Action => ({
    type: "CLEAR_SELECTION",
  }),

  importPhrases: (phrases: Phrase[]): Action => ({
    type: "IMPORT_PHRASES",
    payload: phrases,
  }),

  toggleTheme: (): Action => ({
    type: "TOGGLE_THEME",
  }),

  setViewMode: (mode: ViewMode): Action => ({
    type: "SET_VIEW_MODE",
    payload: mode,
  }),

  setLoading: (loading: boolean): Action => ({
    type: "SET_LOADING",
    payload: loading,
  }),

  setError: (error: string | null): Action => ({
    type: "SET_ERROR",
    payload: error,
  }),
};
