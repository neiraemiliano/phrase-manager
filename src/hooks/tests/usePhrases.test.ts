import { Phrase } from "@/types";
import {
  createPhraseId,
  createNonEmptyString,
  createISODateString,
  createPositiveNumber,
} from "@/types/phrase.types";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePhraseBulkOperations, usePhrases } from "../usePhrases";

// Mock the store
const mockDispatch = vi.fn();
const mockState = {
  phrases: [],
  filter: "",
  selectedPhrases: [],
  selectionMode: false,
  sortBy: "date" as const,
  sortOrder: "desc" as const,
  theme: "light" as const,
  viewMode: "grid" as const,
  isLoading: false,
  error: null,
};

vi.mock("@/store", () => ({
  useStore: () => ({
    state: mockState,
    dispatch: mockDispatch,
  }),
}));

vi.mock("@/utils", () => ({
  generateId: () => "mock-id-123",
}));

// Mock StorageService to prevent storage errors
vi.mock("@/services/storage.service", () => ({
  StorageService: {
    loadPreferences: () => ({ data: undefined }),
    savePreferences: () => ({}),
    loadTheme: () => "dark",
    saveTheme: () => {},
    loadPhrases: () => ({ data: [] }),
    savePhrases: () => ({}),
    clearAll: () => {},
    exportData: () => "{}",
    importData: () => ({ success: true }),
  },
}));

const createMockPhrase = (overrides: Partial<Phrase> = {}): Phrase => ({
  id: createPhraseId("test-id"),
  text: createNonEmptyString("Test phrase"),
  createdAt: createISODateString("2023-01-01T00:00:00Z"),
  tags: ["test"],
  likes: createPositiveNumber(0),
  ...overrides,
});

describe("usePhrases Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.phrases = [];
    mockState.selectedPhrases = [];
    mockState.selectionMode = false;
    mockState.isLoading = false;
    mockState.error = null;
  });

  describe("CRUD Operations", () => {
    it("should create phrase with stable ID", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.createPhrase({
          text: "New test phrase",
          tags: ["new"],
        });
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ADD_PHRASE",
        payload: expect.objectContaining({
          id: "mock-id-123",
          text: "New test phrase",
          tags: ["new"],
          likes: 0,
          createdAt: expect.any(String),
        }),
      });
    });

    it("should update phrase with safe updates", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.updatePhrase("test-id", {
          text: "Updated text",
          id: "should-be-ignored", // Should be filtered out
          createdAt: "should-be-ignored", // Should be filtered out
        });
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_PHRASE",
        payload: {
          id: "test-id",
          updates: {
            text: "Updated text",
          },
        },
      });
    });

    it("should delete single phrase", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.deletePhrase("test-id");
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "DELETE_PHRASE",
        payload: "test-id",
      });
    });

    it("should batch delete multiple phrases", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.batchDelete(["id1", "id2", "id3"]);
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "BATCH_DELETE",
        payload: ["id1", "id2", "id3"],
      });
    });

    it("should import phrases with stable IDs", () => {
      const { result } = renderHook(() => usePhrases());
      const phrasesToImport = [
        { text: "Imported 1", tags: [] },
        {
          id: "existing-id",
          text: "Imported 2",
          createdAt: "2023-01-01",
          tags: [],
        },
      ];

      act(() => {
        result.current.importPhrases(phrasesToImport as Phrase[]);
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "IMPORT_PHRASES",
        payload: [
          expect.objectContaining({
            id: "mock-id-123",
            text: "Imported 1",
            createdAt: expect.any(String),
          }),
          expect.objectContaining({
            id: "existing-id",
            text: "Imported 2",
            createdAt: "2023-01-01",
          }),
        ],
      });
    });
  });

  describe("Selection Operations", () => {
    beforeEach(() => {
      mockState.phrases = [
        createMockPhrase({ id: "1", text: "Phrase 1" }),
        createMockPhrase({ id: "2", text: "Phrase 2" }),
        createMockPhrase({ id: "3", text: "Phrase 3" }),
      ];
    });

    it("should toggle selection mode", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.toggleSelectionMode();
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "TOGGLE_SELECTION_MODE",
      });
    });

    it("should toggle phrase selection", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.togglePhraseSelection("test-id");
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "TOGGLE_PHRASE_SELECTION",
        payload: "test-id",
      });
    });

    it("should clear selection", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.clearSelection();
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "CLEAR_SELECTION",
      });
    });

    it("should select all visible phrases", () => {
      // Mock filtered phrases
      vi.doMock("@/store/selectors", () => ({
        selectFilteredAndSortedPhrases: () => [
          createMockPhrase({ id: "1" }),
          createMockPhrase({ id: "2" }),
        ],
        selectStats: () => ({ total: 2, filtered: 2 }),
      }));

      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.selectAll();
      });

      expect(mockDispatch).toHaveBeenCalledTimes(3);
    });
  });

  describe("Utility Functions", () => {
    beforeEach(() => {
      mockState.phrases = [
        createMockPhrase({ id: "1", text: "Phrase 1", likes: 5 }),
        createMockPhrase({ id: "2", text: "Phrase 2", likes: 10 }),
      ];
    });

    it("should find phrase by id", () => {
      const { result } = renderHook(() => usePhrases());

      const foundPhrase = result.current.findPhraseById("1");
      expect(foundPhrase?.text).toBe("Phrase 1");

      const notFound = result.current.findPhraseById("nonexistent");
      expect(notFound).toBeUndefined();
    });

    it("should duplicate phrase with modifications", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.duplicatePhrase("1");
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ADD_PHRASE",
        payload: expect.objectContaining({
          text: "Phrase 1 (copy)",
          likes: 0, // Reset for duplicated phrase
        }),
      });
    });

    it("should like phrase by incrementing likes", () => {
      const { result } = renderHook(() => usePhrases());

      act(() => {
        result.current.likePhrases("1");
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_PHRASE",
        payload: {
          id: "1",
          updates: { likes: 6 }, // 5 + 1
        },
      });
    });
  });

  describe("Data Derivation", () => {
    it("should provide derived state without duplication", () => {
      mockState.phrases = [createMockPhrase({ id: "1" })];
      mockState.selectedPhrases = ["1"];
      mockState.isLoading = true;
      mockState.error = "Test error";

      const { result } = renderHook(() => usePhrases());

      expect(result.current.allPhrases).toBe(mockState.phrases);
      expect(result.current.selectedPhrases).toBe(mockState.selectedPhrases);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe("Test error");
    });
  });

  describe("Callback Stability", () => {
    it("should maintain stable callbacks across renders", () => {
      const { result, rerender } = renderHook(() => usePhrases());

      const initialCallbacks = {
        createPhrase: result.current.createPhrase,
        updatePhrase: result.current.updatePhrase,
        deletePhrase: result.current.deletePhrase,
      };

      rerender();

      expect(result.current.createPhrase).toBe(initialCallbacks.createPhrase);
      expect(result.current.updatePhrase).toBe(initialCallbacks.updatePhrase);
      expect(result.current.deletePhrase).toBe(initialCallbacks.deletePhrase);
    });
  });
});

describe("usePhraseBulkOperations Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.selectedPhrases = [];
  });

  it("should delete selected phrases", () => {
    mockState.selectedPhrases = ["1", "2", "3"];

    const { result } = renderHook(() => usePhraseBulkOperations());

    act(() => {
      result.current.deleteSelected();
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "BATCH_DELETE",
      payload: ["1", "2", "3"],
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "CLEAR_SELECTION",
    });
  });

  it("should not delete when no selection", () => {
    mockState.selectedPhrases = [];

    const { result } = renderHook(() => usePhraseBulkOperations());

    act(() => {
      result.current.deleteSelected();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should provide selection state", () => {
    mockState.selectedPhrases = ["1", "2"];

    const { result } = renderHook(() => usePhraseBulkOperations());

    expect(result.current.hasSelection).toBe(true);
    expect(result.current.selectionCount).toBe(2);
    expect(result.current.exportSelected()).toEqual(["1", "2"]);
  });

  it("should handle empty selection", () => {
    mockState.selectedPhrases = [];

    const { result } = renderHook(() => usePhraseBulkOperations());

    expect(result.current.hasSelection).toBe(false);
    expect(result.current.selectionCount).toBe(0);
    expect(result.current.exportSelected()).toEqual([]);
  });
});
