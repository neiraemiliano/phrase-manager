export const escapeRegExp = (string: string): string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const normalizeSearchTerm = (term: string): string => {
  return term.trim().replace(/\s+/g, " ");
};

// Enhanced regex cache with LRU eviction and better performance
class RegexCache {
  private cache = new Map<string, RegExp | null>();
  private maxSize = 50; // Reduced cache size for better memory usage
  private accessOrder: string[] = [];

  get(term: string): RegExp | null {
    if (this.cache.has(term)) {
      // Move to end (most recently used)
      const index = this.accessOrder.indexOf(term);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
        this.accessOrder.push(term);
      }
      return this.cache.get(term)!;
    }
    return null;
  }

  set(term: string, regex: RegExp | null): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(term)) {
      const oldest = this.accessOrder.shift();
      if (oldest) {
        this.cache.delete(oldest);
      }
    }

    this.cache.set(term, regex);

    // Update access order
    const index = this.accessOrder.indexOf(term);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(term);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.cache.size;
  }
}

const regexCache = new RegexCache();

export const createSearchRegex = (term: string): RegExp | null => {
  // Check cache first
  const cached = regexCache.get(term);
  if (cached !== null) {
    return cached;
  }

  const normalized = normalizeSearchTerm(term);
  if (normalized.length < MIN_SEARCH_LENGTH) {
    regexCache.set(term, null);
    return null;
  }

  const escaped = escapeRegExp(normalized);
  const regex = new RegExp(escaped, "i");

  // Cache the result
  regexCache.set(term, regex);
  return regex;
};

// Search result cache for expensive operations
class SearchResultCache {
  private cache = new Map<string, any>();
  private maxSize = 100;
  private accessOrder: string[] = [];

  private createKey(term: string, dataHash: string): string {
    return `${term}:${dataHash}`;
  }

  get(term: string, dataHash: string): any {
    const key = this.createKey(term, dataHash);
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
        this.accessOrder.push(key);
      }
      return this.cache.get(key);
    }
    return null;
  }

  set(term: string, dataHash: string, result: any): void {
    const key = this.createKey(term, dataHash);

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldest = this.accessOrder.shift();
      if (oldest) {
        this.cache.delete(oldest);
      }
    }

    this.cache.set(key, result);

    // Update access order
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.cache.size;
  }
}

const searchResultCache = new SearchResultCache();

// Generate simple hash for data to detect changes
export const generateDataHash = (data: any[]): string => {
  return `${data.length}_${data[0]?.id || ""}_${data[data.length - 1]?.id || ""}`;
};

// Export cache instances for cleanup if needed
export const clearSearchCaches = (): void => {
  regexCache.clear();
  searchResultCache.clear();
};

export const getSearchCacheStats = () => ({
  regexCache: regexCache.size(),
  searchResultCache: searchResultCache.size(),
});

export const MIN_SEARCH_LENGTH = 2;
export const OPTIMAL_DEBOUNCE_DELAY = 400; // ms - optimal for user experience
