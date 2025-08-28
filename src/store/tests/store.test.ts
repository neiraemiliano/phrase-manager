import { describe, it, expect, beforeEach } from "vitest";
import { Store } from "../store";
import { rootReducer } from "../reducer";
import { actions } from "../actions";
import { AppState } from "@/types";
import {
  createPhraseId,
  createNonEmptyString,
  createISODateString,
  createPositiveNumber,
} from "@/types/phrase.types";

describe("Store", () => {
  let store: Store;
  let initialState: AppState;

  beforeEach(() => {
    initialState = {
      phrases: [],
      filter: "",
      selectedPhrases: [],
      selectionMode: false,
      sortBy: "date",
      sortOrder: "desc",
      theme: "dark",
      viewMode: "grid",
      isLoading: false,
      error: null,
    };
    store = new Store(rootReducer, initialState);
  });

  describe("getState", () => {
    it("should return the current state", () => {
      expect(store.getState()).toEqual(initialState);
    });
  });

  describe("dispatch", () => {
    it("should update state when dispatching ADD_PHRASE action", () => {
      const phrase = {
        id: createPhraseId("1"),
        text: createNonEmptyString("Test phrase"),
        createdAt: createISODateString(new Date().toISOString()),
        tags: ["test"],
        likes: createPositiveNumber(0),
      };

      store.dispatch(actions.addPhrase(phrase));

      const state = store.getState();
      expect(state.phrases).toHaveLength(1);
      expect(state.phrases[0]).toEqual(phrase);
    });

    it("should update state when dispatching DELETE_PHRASE action", () => {
      const phrase = {
        id: createPhraseId("1"),
        text: createNonEmptyString("Test phrase"),
        createdAt: createISODateString(new Date().toISOString()),
        tags: ["test"],
        likes: createPositiveNumber(0),
      };

      store.dispatch(actions.addPhrase(phrase));
      store.dispatch(actions.deletePhrase(createPhraseId("1")));

      const state = store.getState();
      expect(state.phrases).toHaveLength(0);
    });

    it("should toggle theme", () => {
      expect(store.getState().theme).toBe("dark");

      store.dispatch(actions.toggleTheme());
      expect(store.getState().theme).toBe("light");

      store.dispatch(actions.toggleTheme());
      expect(store.getState().theme).toBe("dark");
    });
  });

  describe("subscribe", () => {
    it("should notify subscribers when state changes", () => {
      let notified = false;
      const unsubscribe = store.subscribe(() => {
        notified = true;
      });

      store.dispatch(actions.setFilter("test"));

      expect(notified).toBe(true);

      unsubscribe();
    });

    it("should not notify unsubscribed listeners", () => {
      let count = 0;
      const unsubscribe = store.subscribe(() => {
        count++;
      });

      store.dispatch(actions.setFilter("test1"));
      expect(count).toBe(1);

      unsubscribe();

      store.dispatch(actions.setFilter("test2"));
      expect(count).toBe(1);
    });
  });
});
