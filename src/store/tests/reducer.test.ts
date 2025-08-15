import { describe, it, expect } from "vitest";
import { rootReducer } from "../reducer";
import { AppState } from "@types";

describe("rootReducer", () => {
  const initialState: AppState = {
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

  describe("ADD_PHRASE", () => {
    it("should add a phrase to the beginning of the list", () => {
      const phrase = {
        id: "1",
        text: "New phrase",
        createdAt: new Date().toISOString(),
        tags: ["test"],
        likes: 0,
      };

      const newState = rootReducer(initialState, {
        type: "ADD_PHRASE",
        payload: phrase,
      });

      expect(newState.phrases).toHaveLength(1);
      expect(newState.phrases[0]).toEqual(phrase);
    });
  });

  describe("DELETE_PHRASE", () => {
    it("should remove a phrase by id", () => {
      const stateWithPhrases = {
        ...initialState,
        phrases: [
          { id: "1", text: "Phrase 1", createdAt: "", tags: [], likes: 0 },
          { id: "2", text: "Phrase 2", createdAt: "", tags: [], likes: 0 },
        ],
      };

      const newState = rootReducer(stateWithPhrases, {
        type: "DELETE_PHRASE",
        payload: "1",
      });

      expect(newState.phrases).toHaveLength(1);
      expect(newState.phrases[0].id).toBe("2");
    });

    it("should remove phrase from selected list when deleted", () => {
      const stateWithSelection = {
        ...initialState,
        phrases: [
          { id: "1", text: "Phrase 1", createdAt: "", tags: [], likes: 0 },
        ],
        selectedPhrases: ["1"],
      };

      const newState = rootReducer(stateWithSelection, {
        type: "DELETE_PHRASE",
        payload: "1",
      });

      expect(newState.selectedPhrases).toHaveLength(0);
    });
  });

  describe("SET_FILTER", () => {
    it("should set the filter value", () => {
      const newState = rootReducer(initialState, {
        type: "SET_FILTER",
        payload: "search term",
      });

      expect(newState.filter).toBe("search term");
    });
  });

  describe("TOGGLE_SELECTION_MODE", () => {
    it("should toggle selection mode", () => {
      const newState = rootReducer(initialState, {
        type: "TOGGLE_SELECTION_MODE",
      });

      expect(newState.selectionMode).toBe(true);

      const finalState = rootReducer(newState, {
        type: "TOGGLE_SELECTION_MODE",
      });

      expect(finalState.selectionMode).toBe(false);
    });

    it("should clear selected phrases when disabling selection mode", () => {
      const stateWithSelection = {
        ...initialState,
        selectionMode: true,
        selectedPhrases: ["1", "2"],
      };

      const newState = rootReducer(stateWithSelection, {
        type: "TOGGLE_SELECTION_MODE",
      });

      expect(newState.selectionMode).toBe(false);
      expect(newState.selectedPhrases).toHaveLength(0);
    });
  });
});
