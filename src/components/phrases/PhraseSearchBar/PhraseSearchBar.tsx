import { useSearch } from "@/hooks";
import { combineClasses } from "@/styles/design-system";
import { MIN_SEARCH_LENGTH } from "@/utils";
import { useText } from "@contexts/TextContext";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const PhraseSearchBar: React.FC = () => {
  const { t } = useText();
  const {
    searchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
    searchSuggestions,
    recentSearches,
  } = useSearch();

  const [localValue, setLocalValue] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value with search term
  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleInputChange = (value: string) => {
    setLocalValue(value);
    setSearchTerm(value); // Use headless hook
    setShowSuggestions(value.length >= MIN_SEARCH_LENGTH);
  };

  const handleClear = () => {
    setLocalValue("");
    clearSearch(); // Use headless hook
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalValue(suggestion);
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />

      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() =>
          setShowSuggestions(localValue.length >= MIN_SEARCH_LENGTH)
        }
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={`${t("search.placeholder")} ${t("search.shortcutHint")}`}
        aria-label={t("search.placeholder")}
        aria-describedby="search-status"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        className={combineClasses(
          "w-full pl-10 pr-10 py-3 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "border-gray-300 dark:border-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
        )}
      />

      <div
        id="search-status"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isSearching ? t("search.searching") : ""}
      </div>

      {isSearching && (
        <Loader2
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-purple-500 w-4 h-4 animate-spin"
          aria-label={t("search.searching")}
        />
      )}

      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          title={t("search.clear")}
          aria-label={t("search.clear")}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {showSuggestions &&
        (searchSuggestions.length > 0 || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
            {searchSuggestions.length > 0 && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t("search.suggestions")}
                </div>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t("search.recent")}
                </div>
                {recentSearches.slice(0, 5).map((recent, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(recent)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
};
