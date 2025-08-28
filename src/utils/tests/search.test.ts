import { describe, it, expect } from "vitest";
import {
  escapeRegExp,
  normalizeSearchTerm,
  createSearchRegex,
  MIN_SEARCH_LENGTH,
} from "../search";

describe("Search utilities", () => {
  describe("escapeRegExp", () => {
    it("should escape special regex characters", () => {
      const input = "Hello (world) [test] {more} special.chars?*+^$|\\";
      const escaped = escapeRegExp(input);
      expect(escaped).toBe(
        "Hello \\(world\\) \\[test\\] \\{more\\} special\\.chars\\?\\*\\+\\^\\$\\|\\\\",
      );
    });

    it("should not escape normal characters", () => {
      const input = "hello world 123";
      const escaped = escapeRegExp(input);
      expect(escaped).toBe("hello world 123");
    });
  });

  describe("normalizeSearchTerm", () => {
    it("should trim whitespace", () => {
      expect(normalizeSearchTerm("  hello world  ")).toBe("hello world");
    });

    it("should collapse multiple spaces", () => {
      expect(normalizeSearchTerm("hello    world     test")).toBe(
        "hello world test",
      );
    });

    it("should handle mixed whitespace", () => {
      expect(normalizeSearchTerm("  hello    world  ")).toBe("hello world");
    });

    it("should return empty string for whitespace-only input", () => {
      expect(normalizeSearchTerm("   ")).toBe("");
    });
  });

  describe("createSearchRegex", () => {
    it("should return null for terms shorter than MIN_SEARCH_LENGTH", () => {
      expect(createSearchRegex("")).toBeNull();
      expect(createSearchRegex("a")).toBeNull();
      expect(createSearchRegex("  ")).toBeNull();
    });

    it("should create case-insensitive regex for valid terms", () => {
      const regex = createSearchRegex("hello");
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex!.flags).toContain("i");
      expect(regex!.test("Hello")).toBe(true);
      expect(regex!.test("HELLO")).toBe(true);
      expect(regex!.test("hello")).toBe(true);
    });

    it("should escape special characters in search terms", () => {
      const regex = createSearchRegex("hello (world)");
      expect(regex!.test("hello (world)")).toBe(true);
      expect(regex!.test("hello world")).toBe(false);
    });

    it("should normalize terms before creating regex", () => {
      const regex = createSearchRegex("  hello   world  ");
      expect(regex!.test("hello world")).toBe(true);
    });
  });

  describe("MIN_SEARCH_LENGTH", () => {
    it("should be a positive number", () => {
      expect(typeof MIN_SEARCH_LENGTH).toBe("number");
      expect(MIN_SEARCH_LENGTH).toBeGreaterThan(0);
    });
  });
});
