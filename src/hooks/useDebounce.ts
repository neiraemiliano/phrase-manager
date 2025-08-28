import { useState, useEffect, useRef } from "react";

export function useDebounce<T>(
  value: T,
  delay: number,
  shouldDebounce?: (val: T) => boolean,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (shouldDebounce && !shouldDebounce(value)) {
      setDebouncedValue(value);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, shouldDebounce]);

  return debouncedValue;
}
