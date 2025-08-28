import { useCallback, useRef } from "react";

export const useFocusManagement = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (
      previousFocusRef.current &&
      document.contains(previousFocusRef.current)
    ) {
      previousFocusRef.current.focus();
    }
  }, []);

  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, []);

  return {
    saveFocus,
    restoreFocus,
    focusElement,
  };
};
