import { AppState } from "@/types";
import { SORT_OPTIONS, SORT_ORDERS, THEME, VIEW_MODES } from "@/utils";
import { StorageService } from "@services/storage.service";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { rootReducer } from "./reducer";
import { Store } from "./store";

const StoreContext = createContext<Store | null>(null);

const loadInitialState = (): AppState => {
  try {
    const phrasesResult = StorageService.loadPhrases();
    const savedTheme = StorageService.loadTheme();
    const preferencesResult = StorageService.loadPreferences();

    if (phrasesResult.error) {
      console.error("Error loading phrases:", phrasesResult.error);
    }

    if (preferencesResult.error) {
      console.error("Error loading preferences:", preferencesResult.error);
    }

    const baseState: AppState = {
      phrases: phrasesResult.data || [],
      filter: "",
      selectedPhrases: [],
      selectionMode: false,
      sortBy: preferencesResult.data?.sortBy || SORT_OPTIONS.DATE,
      sortOrder: preferencesResult.data?.sortOrder || SORT_ORDERS.DESC,
      theme: savedTheme,
      viewMode: preferencesResult.data?.viewMode || VIEW_MODES.GRID,
      isLoading: false,
      error: phrasesResult.error ? phrasesResult.error.message : null,
    };

    if (savedTheme === THEME.DARK)
      document.documentElement.classList.add(THEME.DARK);
    else document.documentElement.classList.remove(THEME.DARK);

    return baseState;
  } catch (error) {
    console.error("Error loading persisted state:", error);
    return getDefaultState();
  }
};

export const initialState = (): AppState => ({
  phrases: [],
  filter: "",
  selectedPhrases: [],
  selectionMode: false,
  sortBy: SORT_OPTIONS.DATE,
  sortOrder: SORT_ORDERS.DESC,
  theme: THEME.DARK,
  viewMode: VIEW_MODES.GRID,
  isLoading: false,
  error: null,
});

const getDefaultState = (): AppState => initialState();

interface StoreProviderProps {
  children: React.ReactNode;
  initialState?: AppState;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  initialState: providedInitialState,
}) => {
  const [store] = React.useState(
    () => new Store(rootReducer, providedInitialState || loadInitialState()),
  );
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        const state = store.getState();

        const saveResult = StorageService.savePhrases(state.phrases);
        if (saveResult.error) {
          console.error("Error saving phrases:", saveResult.error);
        }

        StorageService.saveTheme(state.theme);

        const prefsResult = StorageService.savePreferences({
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          viewMode: state.viewMode,
        });
        if (prefsResult.error) {
          console.error("Error saving preferences:", prefsResult.error);
        }
      }, 1000);
    });

    const state = store.getState();
    const initialSaveResult = StorageService.savePhrases(state.phrases);
    if (initialSaveResult.error) {
      console.error("Error saving phrases on init:", initialSaveResult.error);
    }

    return () => {
      unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [store]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within StoreProvider");
  }

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    return store.subscribe(forceUpdate);
  }, [store]);

  return {
    state: store.getState(),
    dispatch: store.dispatch,
  };
};
