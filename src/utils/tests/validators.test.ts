import { describe, it, expect } from "vitest";
import { validators } from "../validators";

describe("validators", () => {
  describe("required", () => {
    it("should return error for empty value", () => {
      const validator = validators.required();

      expect(validator("")).toBe("Field is required");
      expect(validator(null)).toBe("Field is required");
      expect(validator(undefined)).toBe("Field is required");
      expect(validator("  ")).toBe("Field is required");
    });

    it("should return null for valid value", () => {
      const validator = validators.required();

      expect(validator("value")).toBeNull();
      expect(validator("0")).toBeNull();
    });

    it("should use custom error message", () => {
      const validator = validators.required("Custom error");

      expect(validator("")).toBe("Custom error");
    });
  });

  describe("minLength", () => {
    it("should validate minimum length", () => {
      const validator = validators.minLength(3);

      expect(validator("ab")).toBe("Must be at least 3 characters");
      expect(validator("abc")).toBeNull();
      expect(validator("abcd")).toBeNull();
    });

    it("should use custom error message", () => {
      const validator = validators.minLength(3, "Too short");

      expect(validator("ab")).toBe("Too short");
    });
  });

  describe("maxLength", () => {
    it("should validate maximum length", () => {
      const validator = validators.maxLength(5);

      expect(validator("12345")).toBeNull();
      expect(validator("123456")).toBe("Must be at most 5 characters");
    });
  });

  describe("pattern", () => {
    it("should validate against regex pattern", () => {
      const validator = validators.pattern(
        /^[a-z]+$/,
        "Only lowercase letters",
      );

      expect(validator("abc")).toBeNull();
      expect(validator("ABC")).toBe("Only lowercase letters");
      expect(validator("123")).toBe("Only lowercase letters");
    });
  });

  describe("compose", () => {
    it("should compose multiple validators", () => {
      const validator = validators.compose(
        validators.required("Required"),
        validators.minLength(3, "Min 3"),
        validators.maxLength(10, "Max 10"),
      );

      expect(validator("")).toBe("Required");
      expect(validator("ab")).toBe("Min 3");
      expect(validator("12345678901")).toBe("Max 10");
      expect(validator("12345")).toBeNull();
    });

    it("should stop at first error", () => {
      const validator = validators.compose(
        validators.required("Required"),
        validators.minLength(100, "This should not appear"),
      );

      expect(validator("")).toBe("Required");
    });
  });
});
