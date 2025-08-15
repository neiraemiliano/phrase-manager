import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhraseSearchBar } from "../PhraseSearchBar/PhraseSearchBar";

vi.mock("@/contexts/TextContext", () => ({
  TextProvider: ({ children }: { children: React.ReactNode }) => children,
  useText: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "search.placeholder":
          "Buscar frases, etiquetas, autores o categorías..",
      };
      return translations[key] || key;
    },
    language: "es",
    setLanguage: vi.fn(),
  }),
}));

const dispatchSpy = vi.fn();

vi.mock("@/store", () => {
  return {
    actions: {
      setFilter: (value: string) => ({ type: "SET_FILTER", payload: value }),
    },
    useStore: () => ({
      state: { filter: "initial search" },
      dispatch: dispatchSpy,
    }),
  };
});
describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    dispatchSpy.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should render with placeholder", () => {
    render(<PhraseSearchBar />);

    expect(screen.getByPlaceholderText(/buscar frases/i)).toBeInTheDocument();
  });

  it("should display initial value", () => {
    render(<PhraseSearchBar />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("initial search");
  });
});
