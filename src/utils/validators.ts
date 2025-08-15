import { Validator } from "@/types";

export const validators = {
  required:
    <T>(message = "Field is required"): Validator<T> =>
    (value) => {
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && !value.trim())
      ) {
        return message;
      }
      return null;
    },

  minLength:
    (min: number, message?: string): Validator<string> =>
    (value) => {
      if (value && value.length < min) {
        return message || `Must be at least ${min} characters`;
      }
      return null;
    },

  maxLength:
    (max: number, message?: string): Validator<string> =>
    (value) => {
      if (value && value.length > max) {
        return message || `Must be at most ${max} characters`;
      }
      return null;
    },

  pattern:
    (regex: RegExp, message?: string): Validator<string> =>
    (value) => {
      if (value && !regex.test(value)) {
        return message || "Invalid format";
      }
      return null;
    },

  compose:
    <T>(...validators: Validator<T>[]): Validator<T> =>
    (value) => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return null;
    },
};
