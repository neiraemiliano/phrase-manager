import { describe, it, expect } from "vitest";
import { formatShortDate } from "../formatters";

describe("formatters", () => {
  describe("formatShortDate", () => {
    it("should format date in short format", () => {
      const date = new Date("2024-01-15");
      const result = formatShortDate(date);

      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it("should accept string dates", () => {
      const result = formatShortDate("2024-01-15");

      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });
});
