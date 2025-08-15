import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhraseForm } from "../PhraseForm/PhraseForm";
import React from "react";
import { LIMITS } from "@utils/constants";

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

const dispatchMock = vi.fn();
vi.mock("@/store", () => ({
  useStore: () => ({ state: {}, dispatch: dispatchMock }),
  actions: {
    addPhrase: vi.fn((p: any) => ({ type: "ADD_PHRASE", payload: p })),
  },
}));

vi.mock("@/components/common/Toast/Toast", () => ({
  toast: { success: vi.fn() },
}));

describe("PhraseForm", () => {
  it("should render all form fields", () => {
    render(<PhraseForm />);

    expect(screen.getByLabelText(/frase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/etiquetas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/autor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
  });

  it("should validate minimum length", async () => {
    const user = userEvent.setup();
    render(<PhraseForm />);

    await user.type(screen.getByLabelText(/frase/i), "ab");
    await user.click(screen.getByRole("button", { name: /agregar/i }));

    await waitFor(() => {
      expect(screen.getByText(/mínimo 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it("should show character count", async () => {
    const user = userEvent.setup();
    render(<PhraseForm />);

    await user.type(screen.getByLabelText(/frase/i), "Hello world");

    expect(
      screen.getByText(`11/${LIMITS.MAX_PHRASE_LENGTH}`)
    ).toBeInTheDocument();
  });

  it("should validate tags pattern", async () => {
    const user = userEvent.setup();
    render(<PhraseForm />);

    await user.type(screen.getByLabelText(/etiquetas/i), "tag@#$%");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/solo letras, números y comas/i)
      ).toBeInTheDocument();
    });
  });
});
