import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExportService } from "../export.service";
import { Phrase } from "@/types";

describe("ExportService", () => {
  let createElementSpy: any;
  let clickSpy: any;

  beforeEach(() => {
    clickSpy = vi.fn();
    createElementSpy = vi.spyOn(document, "createElement").mockReturnValue({
      setAttribute: vi.fn(),
      click: clickSpy,
    } as any);
  });

  describe("exportToJSON", () => {
    it("should export phrases as JSON", () => {
      const phrases: Phrase[] = [
        {
          id: "1",
          text: "Test phrase",
          createdAt: "2024-01-01",
          tags: ["test"],
          likes: 0,
        },
      ];

      ExportService.exportToJSON(phrases);

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(clickSpy).toHaveBeenCalled();
    });

    it("should set correct filename with date", () => {
      const phrases: Phrase[] = [];
      const mockElement = {
        setAttribute: vi.fn(),
        click: vi.fn(),
      };

      document.createElement = vi.fn().mockReturnValue(mockElement as any);

      ExportService.exportToJSON(phrases);

      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        "download",
        expect.stringContaining("phrases-"),
      );
      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        "download",
        expect.stringContaining(".json"),
      );
    });
  });

  describe("importFromJSON", () => {
    it("should import valid JSON file", async () => {
      const phrases: Phrase[] = [
        {
          id: "1",
          text: "Test phrase",
          createdAt: "2024-01-01",
          tags: ["test"],
          likes: 0,
        },
      ];

      const file = new File([JSON.stringify(phrases)], "phrases.json", {
        type: "application/json",
      });

      const result = await ExportService.importFromJSON(file);

      expect(result).toEqual(phrases);
    });

    it("should reject invalid JSON", async () => {
      const file = new File(["invalid json"], "phrases.json", {
        type: "application/json",
      });

      await expect(ExportService.importFromJSON(file)).rejects.toThrow(
        "Invalid JSON file",
      );
    });

    it("should handle file read errors", async () => {
      const file = new File([], "phrases.json", { type: "application/json" });

      const originalFileReader = global.FileReader;
      global.FileReader = class {
        onerror: any;
        readAsText() {
          setTimeout(() => this.onerror && this.onerror(), 0);
        }
      } as any;

      await expect(ExportService.importFromJSON(file)).rejects.toThrow(
        "Error reading file",
      );

      global.FileReader = originalFileReader;
    });
  });

  describe("exportToCSV", () => {
    it("should export phrases as CSV", () => {
      const phrases: Phrase[] = [
        {
          id: "1",
          text: "Test phrase",
          createdAt: "2024-01-01",
          tags: ["tag1", "tag2"],
          author: "John Doe",
          category: "Test",
          likes: 5,
        },
      ];

      const createObjectURLSpy = vi
        .spyOn(URL, "createObjectURL")
        .mockReturnValue("blob:url");

      ExportService.exportToCSV(phrases);

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
