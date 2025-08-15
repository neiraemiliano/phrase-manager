import { AppState, Phrase } from "@/types";

export const createSelector = <T, R>(
  selector: (state: AppState) => T,
  combiner: (value: T) => R
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

export const selectFilteredAndSortedPhrases = (state: AppState): Phrase[] => {
  let filtered = state.phrases;

  if (state.filter) {
    const filterLower = state.filter.toLowerCase();
    filtered = state.phrases.filter(
      (phrase: Phrase) =>
        phrase.text.toLowerCase().includes(filterLower) ||
        phrase.tags?.some((tag) => tag.toLowerCase().includes(filterLower)) ||
        phrase.author?.toLowerCase().includes(filterLower) ||
        phrase.category?.toLowerCase().includes(filterLower)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;

    switch (state.sortBy) {
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

    return state.sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
};

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
              state.phrases.length
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
