import { describe, it, expect } from "vitest";
import { rootReducer } from "../reducer";
import {
  AppState,
  createPositiveNumber,
  createPhraseId,
  createNonEmptyString,
  createISODateString,
} from "../../types";

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
        id: createPhraseId("1"),
        text: createNonEmptyString("New phrase"),
        createdAt: createISODateString(new Date().toISOString()),
        tags: ["test"],
        likes: createPositiveNumber(0),
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
          {
            id: createPhraseId("1"),
            text: createNonEmptyString("Phrase 1"),
            createdAt: createISODateString("2024-01-01T00:00:00Z"),
            tags: [],
            likes: createPositiveNumber(0),
          },
          {
            id: createPhraseId("2"),
            text: createNonEmptyString("Phrase 2"),
            createdAt: createISODateString("2024-01-01T00:00:00Z"),
            tags: [],
            likes: createPositiveNumber(0),
          },
        ],
      };

      const newState = rootReducer(stateWithPhrases, {
        type: "DELETE_PHRASE",
        payload: createPhraseId("1"),
      });

      expect(newState.phrases).toHaveLength(1);
      expect(newState.phrases[0].id).toBe(createPhraseId("2"));
    });

    it("should remove phrase from selected list when deleted", () => {
      const stateWithSelection = {
        ...initialState,
        phrases: [
          {
            id: createPhraseId("1"),
            text: createNonEmptyString("Phrase 1"),
            createdAt: createISODateString("2024-01-01T00:00:00Z"),
            tags: [],
            likes: createPositiveNumber(0),
          },
        ],
        selectedPhrases: [createPhraseId("1")],
      };

      const newState = rootReducer(stateWithSelection, {
        type: "DELETE_PHRASE",
        payload: createPhraseId("1"),
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
        selectedPhrases: [createPhraseId("1"), createPhraseId("2")],
      };

      const newState = rootReducer(stateWithSelection, {
        type: "TOGGLE_SELECTION_MODE",
      });

      expect(newState.selectionMode).toBe(false);
      expect(newState.selectedPhrases).toHaveLength(0);
    });
  });
});
