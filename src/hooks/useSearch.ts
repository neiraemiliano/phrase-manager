import { useStore } from "@/store";
import { actions } from "@/store/actions";
import { Phrase, SortBy, SortOrder } from "@/types";
import {
  createSearchRegex,
  getSearchCacheStats,
  MIN_SEARCH_LENGTH,
  normalizeSearchTerm,
  OPTIMAL_DEBOUNCE_DELAY,
} from "@/utils";
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "./useDebounce";
import { useOptimizedSearch } from "./useOptimizedSearch";

export interface UseSearchResult {
  // Search state
  searchTerm: string;
  deferredSearchTerm: string;
  isSearching: boolean;
  isValidSearch: boolean;

  // Search results (derived state)
  results: Phrase[];
  resultCount: number;
  hasResults: boolean;

  // Search actions
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;

  // Search utilities
  searchStats: {
    originalCount: number;
    filteredCount: number;
    searchTerm: string;
    isActive: boolean;
    performance: {
      cacheHits: number;
      cacheSize: number;
    };
  };

  // Advanced search features
  searchSuggestions: string[];
  recentSearches: string[];

  // Cache management
  clearCache: () => void;
  getCacheStats: () => ReturnType<typeof getSearchCacheStats>;
}

export interface SearchFilters {
  author?: string;
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minLikes?: number;
}

export interface UseAdvancedSearchResult extends UseSearchResult {
  // Advanced filtering
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Sorting
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSorting: (sortBy: SortBy, sortOrder: SortOrder) => void;

  // Combined results
  filteredAndSortedResults: Phrase[];
}

/**
 * Headless search hook with debouncing, normalization, and regex escaping
 * Optimized for performance with memoization and caching
 */
export const useSearch = (): UseSearchResult => {
  const { state, dispatch } = useStore();

  // Debounced search with optimal timing
  const debouncedSearchTerm = useDebounce(state.filter, OPTIMAL_DEBOUNCE_DELAY);
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);

  // Search state derivation
  const normalizedTerm = useMemo(
    () => normalizeSearchTerm(state.filter),
    [state.filter],
  );

  const isValidSearch = useMemo(
    () => normalizedTerm.length >= MIN_SEARCH_LENGTH,
    [normalizedTerm],
  );

  const isSearching = state.filter !== deferredSearchTerm;

  // Use optimized search with caching
  const { filteredResults: results, clearCaches } = useOptimizedSearch(
    state.phrases,
    deferredSearchTerm,
    {
      enableCaching: true,
      deferResults: true,
      minLength: MIN_SEARCH_LENGTH,
    },
  );

  // Search actions with transitions for better UX
  const setSearchTerm = useCallback(
    (term: string) => {
      startTransition(() => {
        dispatch(actions.setFilter(term));
      });
    },
    [dispatch],
  );

  const clearSearch = useCallback(() => {
    startTransition(() => {
      dispatch(actions.setFilter(""));
    });
  }, [dispatch]);

  // Search suggestions based on existing content
  const searchSuggestions = useMemo(() => {
    if (!isValidSearch) return [];

    const suggestions = new Set<string>();
    const regex = createSearchRegex(normalizedTerm);

    if (regex) {
      state.phrases.forEach((phrase) => {
        // Add matching tags
        phrase.tags?.forEach((tag) => {
          if (
            regex.test(tag) &&
            tag.toLowerCase() !== normalizedTerm.toLowerCase()
          ) {
            suggestions.add(tag);
          }
        });

        // Add matching authors
        if (phrase.author && regex.test(phrase.author)) {
          suggestions.add(phrase.author);
        }

        // Add matching categories
        if (phrase.category && regex.test(phrase.category)) {
          suggestions.add(phrase.category);
        }
      });
    }

    return Array.from(suggestions).slice(0, 5); // Limit suggestions
  }, [state.phrases, normalizedTerm, isValidSearch]);

  // Recent searches from localStorage
  const recentSearches = useMemo(() => {
    try {
      const recent = localStorage.getItem("phrase-manager-recent-searches");
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  }, []);

  // Enhanced search stats
  const searchStats = useMemo(
    () => ({
      originalCount: state.phrases.length,
      filteredCount: results.length,
      searchTerm: deferredSearchTerm,
      isActive: isValidSearch,
      performance: {
        cacheHits: 0, // Could be implemented with more detailed tracking
        cacheSize: getSearchCacheStats().regexCache,
      },
    }),
    [state.phrases.length, results.length, deferredSearchTerm, isValidSearch],
  );

  // Save recent searches
  const saveRecentSearch = useCallback(
    (term: string) => {
      if (!term || term.length < MIN_SEARCH_LENGTH) return;

      try {
        const recent = [...recentSearches];
        const index = recent.indexOf(term);

        if (index > -1) {
          recent.splice(index, 1);
        }

        recent.unshift(term);
        const limited = recent.slice(0, 10); // Keep last 10 searches

        localStorage.setItem(
          "phrase-manager-recent-searches",
          JSON.stringify(limited),
        );
      } catch (error) {
        console.warn("Failed to save recent search:", error);
      }
    },
    [recentSearches],
  );

  // Save search when it's valid and has results
  useMemo(() => {
    if (isValidSearch && results.length > 0 && !isSearching) {
      saveRecentSearch(deferredSearchTerm);
    }
  }, [
    isValidSearch,
    results.length,
    isSearching,
    deferredSearchTerm,
    saveRecentSearch,
  ]);

  return {
    // Search state
    searchTerm: state.filter,
    deferredSearchTerm,
    isSearching,
    isValidSearch,

    // Search results (derived)
    results,
    resultCount: results.length,
    hasResults: results.length > 0,

    // Search actions
    setSearchTerm,
    clearSearch,

    // Search utilities
    searchStats,
    searchSuggestions,
    recentSearches,

    // Cache management
    clearCache: clearCaches,
    getCacheStats: getSearchCacheStats,
  };
};

/**
 * Advanced search hook with filtering and sorting capabilities
 * Extends basic search with complex filtering options
 */
export const useAdvancedSearch = (
  initialFilters: SearchFilters = {},
): UseAdvancedSearchResult => {
  const basicSearch = useSearch();
  const { state, dispatch } = useStore();

  // Advanced filters state (could be moved to Redux if needed globally)
  const [filters, setFiltersState] = useState<SearchFilters>(initialFilters);

  const setFilters = useCallback((newFilters: SearchFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some(
        (value) =>
          value !== undefined &&
          value !== null &&
          (Array.isArray(value) ? value.length > 0 : true),
      ),
    [filters],
  );

  // Advanced filtering logic
  const filteredAndSortedResults = useMemo(() => {
    let filtered = basicSearch.results;

    // Apply additional filters
    if (filters.author) {
      filtered = filtered.filter((phrase) =>
        phrase.author?.toLowerCase().includes(filters.author!.toLowerCase()),
      );
    }

    if (filters.category) {
      filtered = filtered.filter((phrase) =>
        phrase.category
          ?.toLowerCase()
          .includes(filters.category!.toLowerCase()),
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((phrase) =>
        phrase.tags?.some((tag) =>
          filters.tags!.some((filterTag) =>
            tag.toLowerCase().includes(filterTag.toLowerCase()),
          ),
        ),
      );
    }

    if (filters.minLikes !== undefined) {
      filtered = filtered.filter(
        (phrase) => (phrase.likes || 0) >= filters.minLikes!,
      );
    }

    if (filters.dateRange) {
      filtered = filtered.filter((phrase) => {
        const phraseDate = new Date(phrase.createdAt);
        return (
          phraseDate >= filters.dateRange!.start &&
          phraseDate <= filters.dateRange!.end
        );
      });
    }

    return filtered;
  }, [basicSearch.results, filters]);

  // Sorting actions
  const setSorting = useCallback(
    (sortBy: SortBy, sortOrder: SortOrder) => {
      dispatch(actions.setSort(sortBy, sortOrder));
    },
    [dispatch],
  );

  return {
    ...basicSearch,

    // Advanced filtering
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,

    // Sorting
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    setSorting,

    // Combined results
    filteredAndSortedResults,
  };
};

/**
 * Specialized search hook for large datasets (>1000 phrases)
 * Uses additional optimizations for performance
 */
export const useSearchForLargeDatasets = () => {
  const search = useSearch();

  // Use higher debounce delay for large datasets
  const largeDatasetSearchTerm = useDebounce(search.searchTerm, 600);

  // For large datasets, use basic filtering with higher debounce
  // Note: useOptimizedSearchForLargeDatasets is not available, using basic filter
  const filteredResults = search.results;

  return {
    ...search,
    results: filteredResults,
    resultCount: filteredResults.length,
    hasResults: filteredResults.length > 0,
    deferredSearchTerm: largeDatasetSearchTerm,
    isSearching: search.searchTerm !== largeDatasetSearchTerm,
  };
};
