import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("should cancel previous timeout on rapid updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    );

    rerender({ value: "update1", delay: 500 });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: "update2", delay: 500 });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: "final", delay: 500 });
    expect(result.current).toBe("initial");
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe("final");
  });
});
