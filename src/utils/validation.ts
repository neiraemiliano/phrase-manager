import { PhraseFormValues, createNonEmptyString } from "@/types";
import {
  FieldValidationRules,
  PHRASE_VALIDATION_CONFIG,
  ValidationError,
  ValidationErrorCode,
  ValidationResult,
} from "@/types/validation.types";

// Type-safe error creation
const createValidationError = (
  field: string,
  message: string,
  code: ValidationErrorCode,
): ValidationError => ({
  field,
  message: createNonEmptyString(message),
  code,
});

// Field-specific validators with strict typing
const validateField = (
  fieldName: keyof PhraseFormValues,
  value: string,
  rules: FieldValidationRules,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = sanitizeInput(value);

  // Required validation
  if (rules.required && !trimmed) {
    errors.push(
      createValidationError(fieldName, `${fieldName} is required`, "REQUIRED"),
    );
    return errors; // Early return if required field is empty
  }

  // Skip other validations if field is optional and empty
  if (!rules.required && !trimmed) {
    return errors;
  }

  // Length validations
  if (rules.minLength !== undefined && trimmed.length < rules.minLength) {
    errors.push(
      createValidationError(
        fieldName,
        `${fieldName} must be at least ${rules.minLength} characters`,
        "TOO_SHORT",
      ),
    );
  }

  if (rules.maxLength !== undefined && trimmed.length > rules.maxLength) {
    errors.push(
      createValidationError(
        fieldName,
        `${fieldName} cannot exceed ${rules.maxLength} characters`,
        "TOO_LONG",
      ),
    );
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmed)) {
    errors.push(
      createValidationError(
        fieldName,
        `${fieldName} has invalid format`,
        "INVALID_FORMAT",
      ),
    );
  }

  // Custom validations
  if (rules.custom) {
    for (const customRule of rules.custom) {
      if (!customRule.validate(trimmed)) {
        errors.push(
          createValidationError(fieldName, customRule.message, "CUSTOM_ERROR"),
        );
      }
    }
  }

  return errors;
};

// Specific tag validation with stricter rules
const validateTags = (tagsString: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!tagsString.trim()) {
    return errors; // Empty tags are allowed
  }

  const tagArray = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  // Max tags count
  const MAX_TAGS = 5;
  if (tagArray.length > MAX_TAGS) {
    errors.push(
      createValidationError(
        "tags",
        `Maximum ${MAX_TAGS} tags allowed`,
        "TOO_LONG",
      ),
    );
  }

  // Individual tag validation
  const MAX_TAG_LENGTH = 20;
  for (const tag of tagArray) {
    if (tag.length > MAX_TAG_LENGTH) {
      errors.push(
        createValidationError(
          "tags",
          `Tag "${tag}" exceeds ${MAX_TAG_LENGTH} characters`,
          "TOO_LONG",
        ),
      );
      break; // Only show first error to avoid spam
    }

    // Tag format validation (alphanumeric + spaces + accents)
    if (!/^[\w\sáéíóúñü]+$/i.test(tag)) {
      errors.push(
        createValidationError(
          "tags",
          `Tag "${tag}" contains invalid characters`,
          "INVALID_FORMAT",
        ),
      );
      break;
    }
  }

  return errors;
};

export const validatePhraseForm = (
  values: PhraseFormValues,
): ValidationResult => {
  const allErrors: ValidationError[] = [];

  // Validate each field with its specific rules
  allErrors.push(
    ...validateField("text", values.text, PHRASE_VALIDATION_CONFIG.text),
  );
  allErrors.push(
    ...validateField("author", values.author, PHRASE_VALIDATION_CONFIG.author),
  );
  allErrors.push(
    ...validateField(
      "category",
      values.category,
      PHRASE_VALIDATION_CONFIG.category,
    ),
  );

  // Special validation for tags
  allErrors.push(...validateTags(values.tags));

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

// Enhanced sanitization with type safety
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,!?áéíóúñü()-]/gi, ""); // Remove potential harmful characters
};

// Type-safe validation helpers
export const isValidTextLength = (text: string): boolean => {
  const trimmed = sanitizeInput(text);
  const { minLength = 0, maxLength = Infinity } = PHRASE_VALIDATION_CONFIG.text;
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

export const getCharacterCount = (text: string): number => {
  return sanitizeInput(text).length;
};

export const getRemainingCharacters = (
  text: string,
  maxLength: number,
): number => {
  return Math.max(0, maxLength - getCharacterCount(text));
};
