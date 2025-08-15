import { LOCAL_STORAGE_KEYS, THEME } from "@/utils";
import { AppState, Action } from "@types";

export const rootReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_PHRASE":
      return {
        ...state,
        phrases: [action.payload, ...state.phrases],
      };

    case "DELETE_PHRASE":
      return {
        ...state,
        phrases: state.phrases.filter((p) => p.id !== action.payload),
        selectedPhrases: state.selectedPhrases.filter(
          (id) => id !== action.payload
        ),
      };

    case "BATCH_DELETE":
      return {
        ...state,
        phrases: state.phrases.filter((p) => !action.payload.includes(p.id)),
        selectedPhrases: [],
        selectionMode: false,
      };

    case "UPDATE_PHRASE":
      return {
        ...state,
        phrases: state.phrases.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };

    case "TOGGLE_SELECTION_MODE":
      return {
        ...state,
        selectionMode: !state.selectionMode,
        selectedPhrases: state.selectionMode ? [] : state.selectedPhrases,
      };

    case "TOGGLE_PHRASE_SELECTION":
      const isSelected = state.selectedPhrases.includes(action.payload);
      return {
        ...state,
        selectedPhrases: isSelected
          ? state.selectedPhrases.filter((id) => id !== action.payload)
          : [...state.selectedPhrases, action.payload],
      };

    case "CLEAR_SELECTION":
      return {
        ...state,
        selectedPhrases: [],
        selectionMode: false,
      };

    case "IMPORT_PHRASES":
      return {
        ...state,
        phrases: [...action.payload, ...state.phrases],
      };

    case "TOGGLE_THEME":
      const newTheme = state.theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
      document.documentElement.classList.toggle(THEME.DARK);
      return {
        ...state,
        theme: newTheme,
      };

    case "SET_VIEW_MODE":
      return {
        ...state,
        viewMode: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
