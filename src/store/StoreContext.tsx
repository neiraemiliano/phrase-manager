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
    const savedPhrases = StorageService.loadPhrases();
    const savedTheme = StorageService.loadTheme();
    const savedPreferences = StorageService.loadPreferences();

    const baseState: AppState = {
      phrases: savedPhrases || [],
      filter: "",
      selectedPhrases: [],
      selectionMode: false,
      sortBy: savedPreferences?.sortBy || SORT_OPTIONS.DATE,
      sortOrder: savedPreferences?.sortOrder || SORT_ORDERS.DESC,
      theme: savedTheme,
      viewMode: savedPreferences?.viewMode || VIEW_MODES.GRID,
      isLoading: false,
      error: null,
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

const getDefaultState = (): AppState => ({
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

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [store] = React.useState(
    () => new Store(rootReducer, loadInitialState())
  );
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        const state = store.getState();

        StorageService.savePhrases(state.phrases);
        StorageService.saveTheme(state.theme);
        StorageService.savePreferences({
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          viewMode: state.viewMode,
        });
      }, 1000);
    });

    const state = store.getState();
    StorageService.savePhrases(state.phrases);

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
