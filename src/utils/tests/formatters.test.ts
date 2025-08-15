import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatShortDate,
  truncateText,
  capitalizeFirst,
  slugify,
} from "../formatters";

describe("formatters", () => {
  describe("formatDate", () => {
    it("should format date in long format", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date);

      expect(result).toContain("enero");
      expect(result).toContain("2024");
    });

    it("should accept string dates", () => {
      const result = formatDate("2024-01-15");

      expect(result).toContain("enero");
      expect(result).toContain("2024");
    });
  });

  describe("formatShortDate", () => {
    it("should format date in short format", () => {
      const date = new Date("2024-01-15");
      const result = formatShortDate(date);

      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  describe("truncateText", () => {
    it("should not truncate short text", () => {
      const result = truncateText("Short text", 20);
      expect(result).toBe("Short text");
    });
  });

  describe("capitalizeFirst", () => {
    it("should capitalize first letter", () => {
      expect(capitalizeFirst("hello")).toBe("Hello");
      expect(capitalizeFirst("WORLD")).toBe("WORLD");
      expect(capitalizeFirst("")).toBe("");
    });
  });
});
