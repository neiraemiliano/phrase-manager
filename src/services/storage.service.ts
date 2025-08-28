import { Phrase, SortBy, SortOrder, Theme, ViewMode } from "@/types";
import { LOCAL_STORAGE_KEYS, THEME } from "@utils/constants";
import {
  AppError,
  createAppError,
  handleSyncOperation,
} from "@utils/error-handling";

interface Preferences {
  sortBy: SortBy;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}

export class StorageService {
  static savePhrases(phrases: Phrase[]): { error?: AppError } {
    return handleSyncOperation(
      () => {
        try {
          const serialized = JSON.stringify(phrases);
          localStorage.setItem(LOCAL_STORAGE_KEYS.PHRASES, serialized);
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "QuotaExceededError"
          ) {
            console.warn("localStorage quota exceeded, attempting cleanup...");
            this.cleanupOldData();

            // Retry after cleanup
            const serialized = JSON.stringify(phrases);
            localStorage.setItem(LOCAL_STORAGE_KEYS.PHRASES, serialized);
          } else {
            throw error;
          }
        }
      },
      "STORAGE_ERROR",
      "Failed to save phrases to storage",
    );
  }

  static loadPhrases(): { data?: Phrase[]; error?: AppError } {
    return handleSyncOperation(
      () => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PHRASES);
        if (!stored) return [];

        const parsed = JSON.parse(stored);

        // Validate structure with type narrowing
        if (!Array.isArray(parsed)) {
          throw createAppError(
            "PARSING_ERROR",
            "Stored phrases data is not an array",
            "INVALID_FORMAT",
          );
        }

        // Validate each phrase has required fields
        const isValidPhrase = (item: unknown): item is Phrase => {
          return (
            typeof item === "object" &&
            item !== null &&
            typeof (item as any).id === "string" &&
            typeof (item as any).text === "string" &&
            typeof (item as any).createdAt === "string" &&
            Array.isArray((item as any).tags)
          );
        };

        const validPhrases = parsed.filter(isValidPhrase);

        if (validPhrases.length !== parsed.length) {
          console.warn(
            `${parsed.length - validPhrases.length} invalid phrases found and filtered out`,
          );
        }

        return validPhrases;
      },
      "STORAGE_ERROR",
      "Failed to load phrases from storage",
    );
  }

  static saveTheme(theme: Theme): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }

  static loadTheme(): Theme {
    return (
      (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme) || THEME.DARK
    );
  }

  static savePreferences(preferences: Preferences): { error?: AppError } {
    return handleSyncOperation(
      () => {
        const serialized = JSON.stringify(preferences);
        localStorage.setItem(LOCAL_STORAGE_KEYS.PREFERENCES, serialized);
      },
      "STORAGE_ERROR",
      "Failed to save preferences",
    );
  }

  static loadPreferences(): { data?: Preferences; error?: AppError } {
    return handleSyncOperation(
      () => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PREFERENCES);
        if (!stored) return undefined;

        const parsed = JSON.parse(stored);

        // Validate preferences structure
        if (typeof parsed !== "object" || parsed === null) {
          throw createAppError(
            "PARSING_ERROR",
            "Stored preferences data is invalid",
            "INVALID_FORMAT",
          );
        }

        // Type narrowing for preferences
        const isValidPreferences = (data: unknown): data is Preferences => {
          return (
            typeof data === "object" &&
            data !== null &&
            "sortBy" in data &&
            "sortOrder" in data &&
            "viewMode" in data
          );
        };

        if (!isValidPreferences(parsed)) {
          throw createAppError(
            "PARSING_ERROR",
            "Preferences data has invalid structure",
            "INVALID_STRUCTURE",
          );
        }

        return parsed;
      },
      "STORAGE_ERROR",
      "Failed to load preferences",
    );
  }

  static clearAll(): void {
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  static getStorageSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  static cleanupOldData(): void {
    const result = this.loadPhrases();
    if (result.data && result.data.length > 100) {
      const recentPhrases = result.data
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 100);
      this.savePhrases(recentPhrases);
    }
  }

  static exportData(): string {
    const data = {
      phrases: this.loadPhrases(),
      theme: this.loadTheme(),
      preferences: this.loadPreferences(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonString: string): {
    success?: boolean;
    error?: AppError;
  } {
    return handleSyncOperation(
      () => {
        if (typeof jsonString !== "string" || !jsonString.trim()) {
          throw createAppError(
            "VALIDATION_ERROR",
            "Import data must be a non-empty string",
            "INVALID_INPUT",
          );
        }

        const data = JSON.parse(jsonString);

        // Validate data structure
        if (typeof data !== "object" || data === null) {
          throw createAppError(
            "PARSING_ERROR",
            "Import data must be a valid JSON object",
            "INVALID_FORMAT",
          );
        }

        let hasImported = false;

        // Import phrases with validation
        if (data.phrases) {
          const phrasesResult = this.savePhrases(data.phrases);
          if (phrasesResult.error) {
            throw (
              phrasesResult.error.originalError ||
              new Error(phrasesResult.error.message)
            );
          }
          hasImported = true;
        }

        // Import theme
        if (data.theme && (data.theme === "light" || data.theme === "dark")) {
          this.saveTheme(data.theme);
          hasImported = true;
        }

        // Import preferences
        if (data.preferences && typeof data.preferences === "object") {
          const prefsResult = this.savePreferences(data.preferences);
          if (prefsResult.error) {
            throw (
              prefsResult.error.originalError ||
              new Error(prefsResult.error.message)
            );
          }
          hasImported = true;
        }

        if (!hasImported) {
          throw createAppError(
            "VALIDATION_ERROR",
            "No valid data found to import",
            "NO_VALID_DATA",
          );
        }

        return true;
      },
      "PARSING_ERROR",
      "Failed to import data",
    );
  }
}
