import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhraseCard } from "../PhraseCard/PhraseCard";
import { Phrase } from "@/types";

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
    id: "1",
    text: "Test phrase text",
    createdAt: "2024-01-15T10:00:00Z",
    tags: ["test", "react"],
    author: "John Doe",
    category: "Testing",
    likes: 5,
  };

  it("should render phrase text", () => {
    render(<PhraseCard phrase={mockPhrase} />);
    expect(screen.getByText("Test phrase text")).toBeInTheDocument();
  });

  it("should render author and tags", () => {
    render(<PhraseCard phrase={mockPhrase} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("should display likes count", () => {
    render(<PhraseCard phrase={mockPhrase} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
