import { describe, it, expect, vi, beforeEach } from "vitest";
import { StorageService } from "../storage.service";
import { Phrase } from "@types";

describe("StorageService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("savePhrases", () => {
    it("should save phrases to localStorage", () => {
      const phrases: Phrase[] = [
        {
          id: "1",
          text: "Test phrase",
          createdAt: "2024-01-01",
          tags: ["test"],
          likes: 0,
        },
      ];

      StorageService.savePhrases(phrases);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "phrase_manager_phrases",
        JSON.stringify(phrases)
      );
    });

    it("should handle errors gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error("Storage error");
      });

      const phrases: Phrase[] = [];
      StorageService.savePhrases(phrases);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving phrases:",
        expect.any(Error)
      );
    });
  });

  describe("loadPhrases", () => {
    it("should load phrases from localStorage", () => {
      const phrases: Phrase[] = [
        {
          id: "1",
          text: "Test phrase",
          createdAt: "2024-01-01",
          tags: ["test"],
          likes: 0,
        },
      ];

      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(phrases));

      const result = StorageService.loadPhrases();

      expect(result).toEqual(phrases);
      expect(localStorage.getItem).toHaveBeenCalledWith(
        "phrase_manager_phrases"
      );
    });

    it("should return null if no data", () => {
      localStorage.getItem = vi.fn().mockReturnValue(null);

      const result = StorageService.loadPhrases();

      expect(result).toBeNull();
    });

    it("should handle parse errors", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      localStorage.getItem = vi.fn().mockReturnValue("invalid json");

      const result = StorageService.loadPhrases();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("loadTheme", () => {
    it("should load theme from localStorage", () => {
      localStorage.getItem = vi.fn().mockReturnValue("light");

      const result = StorageService.loadTheme();

      expect(result).toBe("light");
    });

    it("should return dark as default", () => {
      localStorage.getItem = vi.fn().mockReturnValue(null);

      const result = StorageService.loadTheme();

      expect(result).toBe("dark");
    });
  });

  describe("clearAll", () => {
    it("should clear all storage keys", () => {
      StorageService.clearAll();

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "phrase_manager_theme"
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "phrase_manager_phrases"
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "phrase_manager_preferences"
      );
    });
  });
});
