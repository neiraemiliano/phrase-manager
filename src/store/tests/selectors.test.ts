import { describe, it, expect } from "vitest";
import { selectFilteredAndSortedPhrases, selectStats } from "../selectors";
import { AppState, Phrase } from "@types";

describe("Selectors", () => {
  const createPhrase = (id: string, text: string, date: string): Phrase => ({
    id,
    text,
    createdAt: date,
    tags: [],
    likes: 0,
  });

  describe("selectFilteredAndSortedPhrases", () => {
    it("should filter phrases by text", () => {
      const state: AppState = {
        phrases: [
          createPhrase("1", "Hello world", "2024-01-01"),
          createPhrase("2", "Goodbye world", "2024-01-02"),
          createPhrase("3", "Hello again", "2024-01-03"),
        ],
        filter: "hello",
        selectedPhrases: [],
        selectionMode: false,
        sortBy: "date",
        sortOrder: "asc",
        theme: "dark",
        viewMode: "grid",
        isLoading: false,
        error: null,
      };

      const result = selectFilteredAndSortedPhrases(state);

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("Hello world");
      expect(result[1].text).toBe("Hello again");
    });

    it("should sort phrases by date ascending", () => {
      const state: AppState = {
        phrases: [
          createPhrase("1", "C", "2024-01-03"),
          createPhrase("2", "A", "2024-01-01"),
          createPhrase("3", "B", "2024-01-02"),
        ],
        filter: "",
        selectedPhrases: [],
        selectionMode: false,
        sortBy: "date",
        sortOrder: "asc",
        theme: "dark",
        viewMode: "grid",
        isLoading: false,
        error: null,
      };

      const result = selectFilteredAndSortedPhrases(state);

      expect(result).toHaveLength(3);
      expect(result[0].text).toBe("A");
      expect(result[1].text).toBe("B");
      expect(result[2].text).toBe("C");
    });

    it("should sort phrases by text descending", () => {
      const state: AppState = {
        phrases: [
          createPhrase("1", "Apple", "2024-01-01"),
          createPhrase("2", "Zebra", "2024-01-02"),
          createPhrase("3", "Banana", "2024-01-03"),
        ],
        filter: "",
        selectedPhrases: [],
        selectionMode: false,
        sortBy: "text",
        sortOrder: "desc",
        theme: "dark",
        viewMode: "grid",
        isLoading: false,
        error: null,
      };

      const result = selectFilteredAndSortedPhrases(state);

      expect(result[0].text).toBe("Zebra");
      expect(result[1].text).toBe("Banana");
      expect(result[2].text).toBe("Apple");
    });
  });

  describe("selectStats", () => {
    it("should calculate correct statistics", () => {
      const state: AppState = {
        phrases: [
          {
            ...createPhrase("1", "Hello", "2024-01-01"),
            tags: ["tag1", "tag2"],
          },
          { ...createPhrase("2", "World test", "2024-01-02"), tags: ["tag3"] },
          { ...createPhrase("3", "Testing", "2024-01-03"), tags: [] },
        ],
        filter: "",
        selectedPhrases: ["1", "3"],
        selectionMode: true,
        sortBy: "date",
        sortOrder: "asc",
        theme: "dark",
        viewMode: "grid",
        isLoading: false,
        error: null,
      };

      const stats = selectStats(state);

      expect(stats.total).toBe(3);
      expect(stats.filtered).toBe(3);
      expect(stats.selected).toBe(2);
      expect(stats.totalTags).toBe(3);
      expect(stats.avgLength).toBe(Math.round((5 + 10 + 7) / 3));
    });
  });
});
