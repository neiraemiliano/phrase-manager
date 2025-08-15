export const CATEGORIES = [
  "technology",
  "philosophy",
  "bestPractices",
  "architecture",
  "testing",
  "design",
  "methodology",
] as const;

export const SORT_OPTIONS = {
  DATE: "date",
  TEXT: "text",
  LIKES: "likes",
  AUTHOR: "author",
} as const;

export const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
  VIRTUAL: "virtual",
} as const;

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: "phrase_manager_theme",
  PHRASES: "phrase_manager_phrases",
  PREFERENCES: "phrase_manager_preferences",
  LOCALE: "app_locale",
} as const;

export const LIMITS = {
  MIN_PHRASE_LENGTH: 3,
  MAX_PHRASE_LENGTH: 500,
  MAX_TAGS: 5,
  MAX_AUTHOR_LENGTH: 50,
  MAX_PHRASES_STORAGE: 1000,
  AUTOSAVE_DELAY: 1000,
} as const;

export const LOCALE = {
  EN: "en",
  ES: "es",
};

export const COLOR_VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  DANGER: "danger",
  GHOST: "ghost",
} as const;
