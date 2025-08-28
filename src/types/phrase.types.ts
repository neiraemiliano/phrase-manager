// Branded types for domain safety
export type PhraseId = string & { readonly __brand: "PhraseId" };
export type NonEmptyString = string & { readonly __brand: "NonEmptyString" };
export type PositiveNumber = number & { readonly __brand: "PositiveNumber" };
export type ISODateString = string & { readonly __brand: "ISODateString" };

// Type guards for runtime validation
export const isPhraseId = (value: string): value is PhraseId => {
  return typeof value === "string" && value.length > 0;
};

export const isNonEmptyString = (value: string): value is NonEmptyString => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isPositiveNumber = (value: number): value is PositiveNumber => {
  return typeof value === "number" && value >= 0 && !isNaN(value);
};

export const isISODateString = (value: string): value is ISODateString => {
  return typeof value === "string" && !isNaN(Date.parse(value));
};

// Utility functions for creating branded types
export const createPhraseId = (value: string): PhraseId => {
  if (!isPhraseId(value)) {
    throw new Error(`Invalid PhraseId: "${value}"`);
  }
  return value as PhraseId;
};

export const createNonEmptyString = (value: string): NonEmptyString => {
  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid NonEmptyString: "${value}"`);
  }
  return value as NonEmptyString;
};

export const createPositiveNumber = (value: number): PositiveNumber => {
  if (!isPositiveNumber(value)) {
    throw new Error(`Invalid PositiveNumber: ${value}`);
  }
  return value as PositiveNumber;
};

export const createISODateString = (value: string): ISODateString => {
  if (!isISODateString(value)) {
    throw new Error(`Invalid ISODateString: "${value}"`);
  }
  return value as ISODateString;
};

export interface Phrase {
  readonly id: PhraseId;
  readonly text: NonEmptyString;
  readonly createdAt: ISODateString;
  readonly tags: readonly string[];
  readonly author?: NonEmptyString;
  readonly category?: NonEmptyString;
  readonly likes?: PositiveNumber;
}

export interface PhraseFormValues {
  text: string;
  tags: string;
  author: string;
  category: string;
}

export type SortBy = "date" | "text" | "likes" | "author";
export type SortOrder = "asc" | "desc";
export type ViewMode = "grid" | "list" | "virtual";
