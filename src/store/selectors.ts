import { AppState, Phrase } from "@/types";
import { createSearchRegex, normalizeSearchTerm } from "@/utils";

export const createSelector = <T, R>(
  selector: (state: AppState) => T,
  combiner: (value: T) => R,
) => {
  let lastInput: T;
  let lastOutput: R;

  return (state: AppState): R => {
    const input = selector(state);
    if (input !== lastInput) {
      lastInput = input;
      lastOutput = combiner(input);
    }
    return lastOutput;
  };
};

// Remove old caching logic - now handled in utils/search.ts

export const selectFilteredAndSortedPhrases = createSelector(
  (state: AppState) => ({
    phrases: state.phrases,
    filter: state.filter,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  }),
  ({ phrases, filter, sortBy, sortOrder }) => {
    // Ensure phrases is always an array
    const safePhrases = Array.isArray(phrases) ? phrases : [];
    let filtered = safePhrases;

    if (filter && normalizeSearchTerm(filter).length >= 2) {
      const searchRegex = createSearchRegex(filter);

      if (searchRegex) {
        filtered = safePhrases.filter(
          (phrase: Phrase) =>
            searchRegex.test(phrase.text) ||
            phrase.tags?.some((tag) => searchRegex.test(tag)) ||
            (phrase.author && searchRegex.test(phrase.author)) ||
            (phrase.category && searchRegex.test(phrase.category)),
        );
      }
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "text":
          comparison = a.text.localeCompare(b.text);
          break;
        case "likes":
          comparison = (a.likes || 0) - (b.likes || 0);
          break;
        case "author":
          comparison = (a.author || "").localeCompare(b.author || "");
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  },
);

export const selectStats = (state: AppState) => {
  const filtered = selectFilteredAndSortedPhrases(state);

  return {
    total: state.phrases.length,
    filtered: filtered.length,
    selected: state.selectedPhrases.length,
    avgLength:
      state.phrases.length > 0
        ? Math.round(
            state.phrases.reduce((acc, p) => acc + p.text.length, 0) /
              state.phrases.length,
          )
        : 0,
    totalTags: state.phrases.reduce((acc, p) => acc + (p.tags?.length || 0), 0),
    categories: [
      ...new Set(state.phrases.map((p) => p.category).filter(Boolean)),
    ].length,
    authors: [...new Set(state.phrases.map((p) => p.author).filter(Boolean))]
      .length,
  };
};
