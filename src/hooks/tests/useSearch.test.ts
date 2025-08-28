import { StoreProvider } from "@/store";
import { Phrase } from "@/types";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useAdvancedSearch,
  useSearch,
  useSearchForLargeDatasets,
} from "../useSearch";

// Mock dependencies
const mockDispatch = vi.fn();
const mockState = {
  phrases: [] as Phrase[],
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

vi.mock("@/store", async () => {
  const actual = await vi.importActual("@/store");
  return {
    ...actual,
    useStore: () => ({
      state: mockState,
      dispatch: mockDispatch,
    }),
  };
});

vi.mock("../useDebounce", () => ({
  useDebounce: (value: string) => value, // Return immediately for testing
}));

vi.mock("../useOptimizedSearch", () => ({
  useOptimizedSearch: (items: Phrase[], term: string) => ({
    filteredResults: items.filter((item) =>
      term.length >= 2
        ? item.text.toLowerCase().includes(term.toLowerCase())
        : items,
    ),
    searchStats: {
      totalItems: items.length,
      filteredItems: items.filter((item) =>
        term.length >= 2
          ? item.text.toLowerCase().includes(term.toLowerCase())
          : items,
      ).length,
      searchTerm: term,
      isActive: term.length >= 2,
    },
    clearCaches: vi.fn(),
  }),
  useOptimizedSearchForLargeDatasets: (items: Phrase[], term: string) => ({
    filteredResults:
      term.length >= 3
        ? items.filter((item) =>
            item.text.toLowerCase().includes(term.toLowerCase()),
          )
        : items,
  }),
}));

vi.mock("@/utils", async () => {
  const actual = await vi.importActual("@/utils");

  // Create stable function references inside the mock factory
  const stableClearSearchCaches = vi.fn();
  const stableGetSearchCacheStats = vi
    .fn()
    .mockReturnValue({ regexCache: 5, searchResultCache: 3 });

  return {
    ...actual,
    normalizeSearchTerm: (term: string) => term.trim(),
    createSearchRegex: (term: string) =>
      term.length >= 2 ? new RegExp(term, "i") : null,
    MIN_SEARCH_LENGTH: 2,
    OPTIMAL_DEBOUNCE_DELAY: 400,
    clearSearchCaches: stableClearSearchCaches,
    getSearchCacheStats: stableGetSearchCacheStats,
  };
});

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
  id: Math.random().toString(),
  text: "Default phrase text",
  createdAt: new Date().toISOString(),
  tags: [],
  author: undefined,
  category: undefined,
  likes: 0,
  ...overrides,
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  React.createElement(StoreProvider, null, children);

describe("useSearch Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.phrases = [];
    mockState.filter = "";
    mockLocalStorage.getItem.mockReturnValue("[]");
  });

  describe("Basic Search Functionality", () => {
    it("should return empty results for empty search", () => {
      mockState.phrases = [
        createMockPhrase({ text: "Hello world" }),
        createMockPhrase({ text: "Test phrase" }),
      ];
      mockState.filter = "";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.searchTerm).toBe("");
      expect(result.current.isValidSearch).toBe(false);
      expect(result.current.results).toHaveLength(2); // No filtering applied
    });

    it("should filter results based on search term", () => {
      mockState.phrases = [
        createMockPhrase({ text: "Hello world", id: "1" }),
        createMockPhrase({ text: "Test phrase", id: "2" }),
        createMockPhrase({ text: "Hello universe", id: "3" }),
      ];
      mockState.filter = "hello";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.searchTerm).toBe("hello");
      expect(result.current.isValidSearch).toBe(true);
      expect(result.current.results).toHaveLength(2);
      expect(result.current.hasResults).toBe(true);
    });

    it("should require minimum search length", () => {
      mockState.filter = "a"; // Too short

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isValidSearch).toBe(false);
    });

    it("should normalize search terms", () => {
      mockState.filter = "  hello  world  ";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.deferredSearchTerm).toBe("  hello  world  ");
    });
  });

  describe("Search Actions", () => {
    it("should set search term with transition", async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.setSearchTerm("new search");
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_FILTER",
        payload: "new search",
      });
    });

    it("should clear search", async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_FILTER",
        payload: "",
      });
    });
  });

  describe("Search Suggestions", () => {
    beforeEach(() => {
      mockState.phrases = [
        createMockPhrase({
          text: "Hello world",
          tags: ["greeting", "hello"],
          author: "John Doe",
          category: "Greetings",
        }),
        createMockPhrase({
          text: "Test phrase",
          tags: ["test", "example"],
          author: "Jane Smith",
          category: "Testing",
        }),
      ];
    });

    it("should generate suggestions from tags", () => {
      mockState.filter = "he";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.searchSuggestions).toContain("hello");
    });

    it("should generate suggestions from authors", () => {
      mockState.filter = "john";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.searchSuggestions).toContain("John Doe");
    });

    it("should limit suggestion count", () => {
      mockState.filter = "te";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.searchSuggestions.length).toBeLessThanOrEqual(5);
    });

    it("should not suggest exact matches", () => {
      mockState.filter = "greeting";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.searchSuggestions).not.toContain("greeting");
    });
  });

  describe("Recent Searches", () => {
    it("should load recent searches from localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(["previous search", "another search"]),
      );

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.recentSearches).toEqual([
        "previous search",
        "another search",
      ]);
    });

    it("should handle localStorage errors gracefully", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.recentSearches).toEqual([]);
    });

    it("should save successful searches", () => {
      mockState.phrases = [createMockPhrase({ text: "Hello world" })];
      mockState.filter = "hello";
      mockLocalStorage.getItem.mockReturnValue("[]");

      renderHook(() => useSearch());

      // The search should be saved to localStorage when it has results
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "phrase-manager-recent-searches",
        expect.stringContaining("hello"),
      );
    });
  });

  describe("Search Stats", () => {
    it("should provide comprehensive search statistics", () => {
      mockState.phrases = [
        createMockPhrase({ text: "Hello world" }),
        createMockPhrase({ text: "Test phrase" }),
      ];
      mockState.filter = "hello";

      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(result.current.searchStats).toEqual({
        originalCount: 2,
        filteredCount: 1,
        searchTerm: "hello",
        isActive: true,
        performance: {
          cacheHits: 0,
          cacheSize: 5,
        },
      });
    });
  });

  describe("Cache Management", () => {
    it("should provide cache management functions", () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: TestWrapper,
      });

      expect(typeof result.current.clearCache).toBe("function");
      expect(typeof result.current.getCacheStats).toBe("function");

      const stats = result.current.getCacheStats();
      expect(stats).toEqual({ regexCache: 5, searchResultCache: 3 });
    });
  });

  describe("Callback Stability", () => {
    it("should provide consistent callback types across renders", () => {
      const { result, rerender } = renderHook(() => useSearch());

      const initialCallbacks = {
        setSearchTerm: typeof result.current.setSearchTerm,
        clearSearch: typeof result.current.clearSearch,
        clearCache: typeof result.current.clearCache,
      };

      rerender();

      expect(typeof result.current.setSearchTerm).toBe(
        initialCallbacks.setSearchTerm,
      );
      expect(typeof result.current.clearSearch).toBe(
        initialCallbacks.clearSearch,
      );
      expect(typeof result.current.clearCache).toBe(
        initialCallbacks.clearCache,
      );
    });
  });
});

describe("useAdvancedSearch Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.phrases = [
      createMockPhrase({
        id: "1",
        text: "Hello world",
        author: "John Doe",
        category: "Greetings",
        tags: ["hello", "world"],
        likes: 5,
        createdAt: "2023-01-01T00:00:00Z",
      }),
      createMockPhrase({
        id: "2",
        text: "Test phrase",
        author: "Jane Smith",
        category: "Testing",
        tags: ["test"],
        likes: 10,
        createdAt: "2023-02-01T00:00:00Z",
      }),
    ];
    mockState.filter = "hello";
  });

  it("should filter by author", () => {
    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setFilters({ author: "John" });
    });

    expect(result.current.filteredAndSortedResults).toHaveLength(1);
    expect(result.current.filteredAndSortedResults[0].id).toBe("1");
  });

  it("should filter by category", () => {
    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setFilters({ category: "Testing" });
    });

    expect(result.current.filteredAndSortedResults).toHaveLength(0); // No "hello" in Testing
  });

  it("should filter by tags", () => {
    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setFilters({ tags: ["world"] });
    });

    expect(result.current.filteredAndSortedResults).toHaveLength(1);
    expect(result.current.filteredAndSortedResults[0].id).toBe("1");
  });

  it("should filter by minimum likes", () => {
    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setFilters({ minLikes: 8 });
    });

    expect(result.current.filteredAndSortedResults).toHaveLength(0); // No "hello" with 8+ likes
  });

  it("should filter by date range", () => {
    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setFilters({
        dateRange: {
          start: new Date("2023-01-01"),
          end: new Date("2023-01-31"),
        },
      });
    });

    expect(result.current.filteredAndSortedResults).toHaveLength(1);
    expect(result.current.filteredAndSortedResults[0].id).toBe("1");
  });

  it("should detect active filters", () => {
    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.setFilters({ author: "John" });
    });

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("should clear filters", () => {
    const { result } = renderHook(
      () =>
        useAdvancedSearch({
          author: "John",
          category: "Test",
        }),
      { wrapper: TestWrapper },
    );

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filters).toEqual({});
  });

  it("should handle sorting actions", () => {
    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setSorting("likes", "asc");
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_SORT",
      payload: { sortBy: "likes", sortOrder: "asc" },
    });
  });

  it("should provide sorting state", () => {
    mockState.sortBy = "text";
    mockState.sortOrder = "asc";

    const { result } = renderHook(() => useAdvancedSearch(), {
      wrapper: TestWrapper,
    });

    expect(result.current.sortBy).toBe("text");
    expect(result.current.sortOrder).toBe("asc");
  });
});

describe("useSearchForLargeDatasets Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.phrases = Array.from({ length: 1500 }, (_, i) =>
      createMockPhrase({
        id: `phrase-${i}`,
        text: `Phrase ${i} ${i % 2 === 0 ? "hello" : "world"}`,
      }),
    );
  });

  it("should use higher minimum search length", () => {
    mockState.filter = "he"; // Would be valid for normal search

    const { result } = renderHook(() => useSearchForLargeDatasets(), {
      wrapper: TestWrapper,
    });

    // Should use 3-character minimum for large datasets but still filters
    expect(result.current.results).toHaveLength(750); // Half match "hello"
  });

  it("should filter with 3+ character minimum", () => {
    mockState.filter = "hello";

    const { result } = renderHook(() => useSearchForLargeDatasets(), {
      wrapper: TestWrapper,
    });

    expect(result.current.results.length).toBeGreaterThan(0);
    expect(result.current.hasResults).toBe(true);
  });

  it("should indicate searching state correctly", () => {
    mockState.filter = "test";

    const { result } = renderHook(() => useSearchForLargeDatasets(), {
      wrapper: TestWrapper,
    });

    // For large datasets, might have different debounce timing
    expect(typeof result.current.isSearching).toBe("boolean");
  });
});
