import { useMemo, useDeferredValue, useCallback } from "react";
import { Phrase } from "@/types";
import {
  createSearchRegex,
  normalizeSearchTerm,
  MIN_SEARCH_LENGTH,
  generateDataHash,
  clearSearchCaches,
} from "@/utils";

interface UseOptimizedSearchResult {
  filteredResults: Phrase[];
  isSearching: boolean;
  searchStats: {
    totalItems: number;
    filteredItems: number;
    searchTerm: string;
    isActive: boolean;
  };
  clearCaches: () => void;
}

interface SearchOptions {
  enableCaching?: boolean;
  deferResults?: boolean;
  minLength?: number;
}

export const useOptimizedSearch = (
  items: Phrase[],
  searchTerm: string,
  options: SearchOptions = {},
): UseOptimizedSearchResult => {
  const {
    enableCaching = true,
    deferResults = true,
    minLength = MIN_SEARCH_LENGTH,
  } = options;

  // Defer search term for large datasets to maintain UI responsiveness
  const deferredSearchTerm = deferResults
    ? useDeferredValue(searchTerm)
    : searchTerm;
  const isSearching = deferResults && searchTerm !== deferredSearchTerm;

  // Generate data hash for cache invalidation
  const dataHash = useMemo(
    () => (enableCaching ? generateDataHash(items) : ""),
    [items, enableCaching],
  );

  // Memoized search function with caching
  const filteredResults = useMemo(() => {
    const normalizedTerm = normalizeSearchTerm(deferredSearchTerm);

    // Early return for empty search
    if (!normalizedTerm || normalizedTerm.length < minLength) {
      return items;
    }

    // Use optimized regex from cache
    const searchRegex = createSearchRegex(normalizedTerm);
    if (!searchRegex) {
      return items;
    }

    // Perform search with optimized regex
    return items.filter(
      (item: Phrase) =>
        searchRegex.test(item.text) ||
        item.tags?.some((tag) => searchRegex.test(tag)) ||
        (item.author && searchRegex.test(item.author)) ||
        (item.category && searchRegex.test(item.category)),
    );
  }, [items, deferredSearchTerm, minLength, dataHash]);

  // Search statistics for debugging/monitoring
  const searchStats = useMemo(
    () => ({
      totalItems: items.length,
      filteredItems: filteredResults.length,
      searchTerm: deferredSearchTerm,
      isActive: Boolean(
        deferredSearchTerm && deferredSearchTerm.length >= minLength,
      ),
    }),
    [items.length, filteredResults.length, deferredSearchTerm, minLength],
  );

  // Clear caches callback
  const clearCaches = useCallback(() => {
    clearSearchCaches();
  }, []);

  return {
    filteredResults,
    isSearching,
    searchStats,
    clearCaches,
  };
};

// Specialized hook for large datasets (>1000 items)
export const useOptimizedSearchForLargeDatasets = (
  items: Phrase[],
  searchTerm: string,
): UseOptimizedSearchResult => {
  return useOptimizedSearch(items, searchTerm, {
    enableCaching: true,
    deferResults: true,
    minLength: 3, // Higher min length for large datasets
  });
};
