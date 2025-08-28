import { describe, it, expect } from "vitest";
import { validatePhraseForm, sanitizeInput } from "../validation";
import { PHRASE_VALIDATION_CONFIG } from "@/types/validation.types";
import { PhraseFormValues } from "@/types";

describe("Validation utilities", () => {
  describe("validatePhraseForm", () => {
    it("should validate a complete valid form", () => {
      const validForm: PhraseFormValues = {
        text: "This is a valid phrase",
        author: "Test Author",
        category: "Test Category",
        tags: "tag1, tag2, tag3",
      };

      const result = validatePhraseForm(validForm);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    describe("text validation", () => {
      it("should reject empty text", () => {
        const form: PhraseFormValues = {
          text: "",
          author: "",
          category: "",
          tags: "",
        };

        const result = validatePhraseForm(form);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "text",
          message: "text is required",
          code: "REQUIRED",
        });
      });

      it("should reject whitespace-only text", () => {
        const form: PhraseFormValues = {
          text: "   ",
          author: "",
          category: "",
          tags: "",
        };

        const result = validatePhraseForm(form);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "text",
          message: "text is required",
          code: "REQUIRED",
        });
      });

      it("should reject text that is too short", () => {
        const form: PhraseFormValues = {
          text: "Hi",
          author: "",
          category: "",
          tags: "",
        };

        const result = validatePhraseForm(form);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "text",
          message: `text must be at least ${PHRASE_VALIDATION_CONFIG.text.minLength} characters`,
          code: "TOO_SHORT",
        });
      });

      it("should reject text that is too long", () => {
        const longText = "a".repeat(
          PHRASE_VALIDATION_CONFIG.text.maxLength! + 1,
        );
        const form: PhraseFormValues = {
          text: longText,
          author: "",
          category: "",
          tags: "",
        };

        const result = validatePhraseForm(form);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "text",
          message: `text cannot exceed ${PHRASE_VALIDATION_CONFIG.text.maxLength} characters`,
          code: "TOO_LONG",
        });
      });
    });

    describe("author validation", () => {
      it("should accept empty author", () => {
        const form: PhraseFormValues = {
          text: "Valid text",
          author: "",
          category: "",
          tags: "",
        };

        const result = validatePhraseForm(form);
        expect(result.errors.some((e) => e.field === "author")).toBe(false);
      });

      it("should reject author that is too short", () => {
        const form: PhraseFormValues = {
          text: "Valid text",
          author: "A",
          category: "",
          tags: "",
        };

        const result = validatePhraseForm(form);
        expect(result.errors).toContainEqual({
          field: "author",
          message: `author must be at least ${PHRASE_VALIDATION_CONFIG.author.minLength} characters`,
          code: "TOO_SHORT",
        });
      });

      it("should reject author that is too long", () => {
        const longAuthor = "a".repeat(
          PHRASE_VALIDATION_CONFIG.author.maxLength! + 1,
        );
        const form: PhraseFormValues = {
          text: "Valid text",
          author: longAuthor,
          category: "",
          tags: "",
        };

        const result = validatePhraseForm(form);
        expect(result.errors).toContainEqual({
          field: "author",
          message: `author cannot exceed ${PHRASE_VALIDATION_CONFIG.author.maxLength} characters`,
          code: "TOO_LONG",
        });
      });
    });

    describe("tags validation", () => {
      it("should reject too many tags", () => {
        const manyTags = Array(6).fill("tag").join(", "); // 6 tags (max is 5)
        const form: PhraseFormValues = {
          text: "Valid text",
          author: "",
          category: "",
          tags: manyTags,
        };

        const result = validatePhraseForm(form);
        expect(result.errors).toContainEqual({
          field: "tags",
          message: `Maximum 5 tags allowed`,
          code: "TOO_LONG",
        });
      });

      it("should reject tags that are too long", () => {
        const longTag = "a".repeat(21); // 21 characters (max is 20)
        const form: PhraseFormValues = {
          text: "Valid text",
          author: "",
          category: "",
          tags: longTag,
        };

        const result = validatePhraseForm(form);
        expect(result.errors).toContainEqual({
          field: "tags",
          message: `Tag "${longTag}" exceeds 20 characters`,
          code: "TOO_LONG",
        });
      });
    });
  });

  describe("sanitizeInput", () => {
    it("should trim whitespace", () => {
      expect(sanitizeInput("  hello world  ")).toBe("hello world");
    });

    it("should collapse multiple spaces", () => {
      expect(sanitizeInput("hello    world     test")).toBe("hello world test");
    });

    it("should handle mixed whitespace characters", () => {
      expect(sanitizeInput("  hello\t\tworld\n\ntest  ")).toBe(
        "hello world test",
      );
    });
  });
});
