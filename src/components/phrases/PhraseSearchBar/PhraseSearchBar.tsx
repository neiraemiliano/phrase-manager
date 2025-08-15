import { actions, useStore } from "@/store";
import { useText } from "@contexts/TextContext";
import { useDebounce } from "@hooks/useDebounce";
import clsx from "clsx";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const PhraseSearchBar: React.FC = () => {
  const { t } = useText();
  const { state, dispatch } = useStore();
  const [localValue, setLocalValue] = useState(state.filter);
  const debouncedValue = useDebounce(localValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(actions.setFilter(debouncedValue));
  }, [debouncedValue, dispatch]);

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

  const isPending = localValue !== debouncedValue;

  const handleClear = () => {
    setLocalValue("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />

      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={`${t("search.placeholder")} ${t("search.shortcutHint")}`}
        className={clsx(
          "w-full pl-10 pr-10 py-3 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "border-gray-300 dark:border-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        )}
      />

      {isPending && (
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
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
