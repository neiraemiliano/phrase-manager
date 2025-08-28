// Test utilities for creating mock data with proper branded types
import {
  createPhraseId,
  createNonEmptyString,
  createISODateString,
  createPositiveNumber,
  PhraseId,
  NonEmptyString,
  ISODateString,
  PositiveNumber,
} from "@/types/phrase.types";
import { Phrase } from "@/types";

// Safe factory functions for creating test data with branded types
export const createMockPhrase = (
  overrides: Partial<{
    id: string;
    text: string;
    createdAt: string;
    tags: string[];
    author?: string;
    category?: string;
    likes: number;
  }> = {},
): Phrase => {
  const defaults = {
    id: "test-id-" + Math.random().toString(36).substr(2, 9),
    text: "Test phrase text",
    createdAt: new Date().toISOString(),
    tags: [],
    author: undefined,
    category: undefined,
    likes: 0,
  };

  const merged = { ...defaults, ...overrides };

  return {
    id: createPhraseId(merged.id),
    text: createNonEmptyString(merged.text),
    createdAt: createISODateString(merged.createdAt),
    tags: merged.tags,
    author: merged.author ? createNonEmptyString(merged.author) : undefined,
    category: merged.category
      ? createNonEmptyString(merged.category)
      : undefined,
    likes: createPositiveNumber(merged.likes),
  };
};

// Helper for creating PhraseIds from strings in tests
export const toPhraseId = (id: string): PhraseId => createPhraseId(id);
export const toNonEmptyString = (str: string): NonEmptyString =>
  createNonEmptyString(str);
export const toISODateString = (date: string): ISODateString =>
  createISODateString(date);
export const toPositiveNumber = (num: number): PositiveNumber =>
  createPositiveNumber(num);

// Mock TextContext utility
export const createMockTextContext = (
  translations: Record<string, string>,
) => ({
  t: (key: string, params?: Record<string, any>) => {
    let text = translations[key] || key;
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, String(value));
      });
    }
    return text;
  },
  locale: "en" as const,
  setLocale: () => {},
  texts: translations,
});
