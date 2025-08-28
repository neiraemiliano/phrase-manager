import { describe, it, expect } from "vitest";
import { selectFilteredAndSortedPhrases } from "../selectors";
import { AppState, Phrase } from "@/types";

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

const createMockState = (overrides: Partial<AppState> = {}): AppState => ({
  phrases: [],
  filter: "",
  selectedPhrases: [],
  selectionMode: false,
  sortBy: "date",
  sortOrder: "desc",
  theme: "light",
  viewMode: "grid",
  isLoading: false,
  error: null,
  ...overrides,
});

describe("Selectors Integration", () => {
  describe("selectFilteredAndSortedPhrases", () => {
    const phrases: Phrase[] = [
      createMockPhrase({
        id: "1",
        text: "Hello world, this is a test phrase",
        author: "John Doe",
        category: "Testing",
        tags: ["hello", "test"],
        createdAt: "2023-01-01T00:00:00Z",
        likes: 5,
      }),
      createMockPhrase({
        id: "2",
        text: "Another phrase with different content",
        author: "Jane Smith",
        category: "General",
        tags: ["different", "content"],
        createdAt: "2023-01-02T00:00:00Z",
        likes: 3,
      }),
      createMockPhrase({
        id: "3",
        text: "Special characters: (test) [regex] {escape}",
        author: "Test User",
        category: "Special",
        tags: ["special", "regex"],
        createdAt: "2023-01-03T00:00:00Z",
        likes: 10,
      }),
    ];

    describe("filtering", () => {
      it("should return all phrases when no filter is applied", () => {
        const state = createMockState({
          phrases,
          filter: "",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(3);
      });

      it("should filter by text content", () => {
        const state = createMockState({
          phrases,
          filter: "hello world",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("1");
      });

      it("should filter by author", () => {
        const state = createMockState({
          phrases,
          filter: "Jane",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("2");
      });

      it("should filter by category", () => {
        const state = createMockState({
          phrases,
          filter: "Special",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("3");
      });

      it("should filter by tags", () => {
        const state = createMockState({
          phrases,
          filter: "regex",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("3");
      });

      it("should handle case insensitive search", () => {
        const state = createMockState({
          phrases,
          filter: "HELLO",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("1");
      });

      it("should escape special regex characters", () => {
        const state = createMockState({
          phrases,
          filter: "(test)",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("3");
      });

      it("should not filter when search term is too short", () => {
        const state = createMockState({
          phrases,
          filter: "a",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(3); // All phrases returned
      });

      it("should normalize whitespace in search terms", () => {
        const state = createMockState({
          phrases,
          filter: "  hello   world  ",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("1");
      });
    });

    describe("sorting", () => {
      it("should sort by date descending by default", () => {
        const state = createMockState({
          phrases,
          sortBy: "date",
          sortOrder: "desc",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result.map((p) => p.id)).toEqual(["3", "2", "1"]);
      });

      it("should sort by date ascending", () => {
        const state = createMockState({
          phrases,
          sortBy: "date",
          sortOrder: "asc",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result.map((p) => p.id)).toEqual(["1", "2", "3"]);
      });

      it("should sort by likes descending", () => {
        const state = createMockState({
          phrases,
          sortBy: "likes",
          sortOrder: "desc",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result.map((p) => p.id)).toEqual(["3", "1", "2"]);
      });

      it("should sort by text alphabetically", () => {
        const state = createMockState({
          phrases,
          sortBy: "text",
          sortOrder: "asc",
        });

        const result = selectFilteredAndSortedPhrases(state);
        // "Another phrase..." < "Hello world..." < "Special characters..."
        expect(result.map((p) => p.id)).toEqual(["2", "1", "3"]);
      });

      it("should sort by author alphabetically", () => {
        const state = createMockState({
          phrases,
          sortBy: "author",
          sortOrder: "asc",
        });

        const result = selectFilteredAndSortedPhrases(state);
        // "Jane Smith" < "John Doe" < "Test User"
        expect(result.map((p) => p.id)).toEqual(["2", "1", "3"]);
      });
    });

    describe("combined filtering and sorting", () => {
      it("should filter first then sort", () => {
        const phrasesWithCommonWord = [
          createMockPhrase({
            id: "1",
            text: "Test phrase alpha",
            createdAt: "2023-01-01T00:00:00Z",
          }),
          createMockPhrase({
            id: "2",
            text: "Test phrase beta",
            createdAt: "2023-01-02T00:00:00Z",
          }),
          createMockPhrase({
            id: "3",
            text: "Different content",
            createdAt: "2023-01-03T00:00:00Z",
          }),
        ];

        const state = createMockState({
          phrases: phrasesWithCommonWord,
          filter: "Test phrase",
          sortBy: "text",
          sortOrder: "asc",
        });

        const result = selectFilteredAndSortedPhrases(state);
        expect(result).toHaveLength(2);
        expect(result.map((p) => p.id)).toEqual(["1", "2"]); // alpha < beta
      });
    });

    describe("memoization", () => {
      it("should return same reference for same input", () => {
        const state = createMockState({ phrases });

        const result1 = selectFilteredAndSortedPhrases(state);
        const result2 = selectFilteredAndSortedPhrases(state);

        expect(result1).toStrictEqual(result2);
      });

      it("should return new reference when state changes", () => {
        const state1 = createMockState({ phrases });
        const state2 = createMockState({
          phrases,
          filter: "test",
        });

        const result1 = selectFilteredAndSortedPhrases(state1);
        const result2 = selectFilteredAndSortedPhrases(state2);

        expect(result1).not.toBe(result2);
      });
    });
  });
});
