import { NonEmptyString } from "./phrase.types";

export interface ValidationRule<T = any> {
  readonly validate: (value: T) => boolean;
  readonly message: string;
}

export interface FieldValidationRules {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly custom?: ValidationRule[];
}

export interface ValidationError {
  readonly field: string;
  readonly message: NonEmptyString;
  readonly code: ValidationErrorCode;
}

export type ValidationErrorCode =
  | "REQUIRED"
  | "TOO_SHORT"
  | "TOO_LONG"
  | "INVALID_FORMAT"
  | "CUSTOM_ERROR";

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
}

export interface FormValidationState {
  readonly isValidating: boolean;
  readonly hasErrors: boolean;
  readonly errors: Record<string, ValidationError[]>;
  readonly touchedFields: Set<string>;
}

// Type-safe validation configuration
export interface PhraseValidationConfig {
  readonly text: FieldValidationRules;
  readonly author: FieldValidationRules;
  readonly category: FieldValidationRules;
  readonly tags: FieldValidationRules;
}

export const PHRASE_VALIDATION_CONFIG: PhraseValidationConfig = {
  text: {
    required: true,
    minLength: 3,
    maxLength: 500,
  },
  author: {
    required: false,
    minLength: 2,
    maxLength: 50,
  },
  category: {
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  tags: {
    required: false,
    maxLength: 100, // For the tags string, not individual tag
  },
} as const;
