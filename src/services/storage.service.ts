import { Theme, Phrase, SortOrder, SortBy, ViewMode } from "@/types";
import { LOCAL_STORAGE_KEYS, THEME } from "@utils/constants";

interface Preferences {
  sortBy: SortBy;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}

export class StorageService {
  static savePhrases(phrases: Phrase[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PHRASES, JSON.stringify(phrases));
    } catch (error) {
      console.error("Error saving phrases:", error);
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        console.warn("localStorage quota exceeded, attempting cleanup...");
        this.cleanupOldData();
        try {
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.PHRASES,
            JSON.stringify(phrases)
          );
        } catch (retryError) {
          console.error("Failed to save even after cleanup:", retryError);
        }
      }
    }
  }

  static loadPhrases(): Phrase[] | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PHRASES);
      if (!stored) return null;

      const phrases = JSON.parse(stored);
      if (Array.isArray(phrases) && phrases.every((p) => p.id && p.text)) {
        return phrases;
      }
      return null;
    } catch (error) {
      console.error("Error loading phrases:", error);
      return null;
    }
  }

  static saveTheme(theme: Theme): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }

  static loadTheme(): Theme {
    return (
      (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme) || THEME.DARK
    );
  }

  static savePreferences(preferences: Preferences): void {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.PREFERENCES,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  }

  static loadPreferences(): Preferences | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PREFERENCES);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error loading preferences:", error);
      return null;
    }
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
    const phrases = this.loadPhrases();
    if (phrases && phrases.length > 100) {
      const recentPhrases = phrases
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.phrases) {
        this.savePhrases(data.phrases);
      }
      if (data.theme) {
        this.saveTheme(data.theme);
      }
      if (data.preferences) {
        this.savePreferences(data.preferences);
      }
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }
}
