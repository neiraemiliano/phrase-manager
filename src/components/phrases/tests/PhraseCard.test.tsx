import { Phrase } from "@/types";
import {
  createPhraseId,
  createNonEmptyString,
  createISODateString,
  createPositiveNumber,
} from "@/types/phrase.types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhraseCard } from "../PhraseCard/PhraseCard";

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

vi.mock("@/contexts/TextContext", () => ({
  TextProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useText: () => ({
    t: (key: string, params: Record<string, any> = {}) => {
      const map: Record<string, string> = {
        "form.fields.text": "Frase",
        "form.fields.tags": "Etiquetas",
        "form.fields.author": "Autor",
        "form.fields.category": "Categoría",
        "form.placeholders.text": "Escribe una nueva frase...",
        "form.placeholders.tags": "Separadas por coma",
        "form.placeholders.author": "Opcional",
        "form.placeholders.category": "Seleccionar categoría",
        "form.submit": "Agregar Frase",
        "form.submitting": "Agregando...",
        "form.validation.invalidTags": "Solo letras, números y comas",
        "form.validation.textTooShort": `Mínimo ${params.min} caracteres`,
        "form.characterCount": `${params.current}/${params.max}`,
      };
      return map[key] ?? key;
    },
    language: "es",
    setLanguage: vi.fn(),
  }),
}));

describe("PhraseCard", () => {
  const mockPhrase: Phrase = {
    id: createPhraseId("1"),
    text: createNonEmptyString("Test phrase text"),
    createdAt: createISODateString("2024-01-15T10:00:00Z"),
    tags: ["test", "react"],
    author: createNonEmptyString("John Doe"),
    category: createNonEmptyString("Testing"),
    likes: createPositiveNumber(5),
  };

  it("should render phrase text", () => {
    render(<PhraseCard phrase={mockPhrase} />);
    expect(screen.getByText("Test phrase text")).toBeInTheDocument();
  });

  it("should render author and tags", () => {
    render(<PhraseCard phrase={mockPhrase} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Use getAllByText since tags appear in both mobile and desktop views
    const testTags = screen.getAllByText("test");
    expect(testTags.length).toBeGreaterThan(0);

    const reactTags = screen.getAllByText("react");
    expect(reactTags.length).toBeGreaterThan(0);
  });

  it("should display likes count", () => {
    render(<PhraseCard phrase={mockPhrase} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
