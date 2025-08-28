import { Phrase, PhraseId, SortBy, SortOrder, ViewMode } from "./phrase.types";

export interface AppState {
  phrases: Phrase[];
  filter: string;
  selectedPhrases: PhraseId[];
  selectionMode: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
  theme: Theme;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
}

export type Action =
  | { type: "ADD_PHRASE"; payload: Phrase }
  | { type: "DELETE_PHRASE"; payload: PhraseId }
  | { type: "BATCH_DELETE"; payload: PhraseId[] }
  | {
      type: "UPDATE_PHRASE";
      payload: { id: PhraseId; updates: Partial<Phrase> };
    }
  | { type: "SET_FILTER"; payload: string }
  | { type: "SET_SORT"; payload: { sortBy: SortBy; sortOrder: SortOrder } }
  | { type: "TOGGLE_SELECTION_MODE" }
  | { type: "TOGGLE_PHRASE_SELECTION"; payload: PhraseId }
  | { type: "CLEAR_SELECTION" }
  | { type: "IMPORT_PHRASES"; payload: Phrase[] }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

export type Theme = "light" | "dark";
