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

vi.mock("@/hooks", () => ({
  useForm: () => ({
    values: {
      text: "",
      author: "",
      category: "",
      tags: "",
    },
    errors: {},
    touched: {},
    isSubmitting: false,
    handleChange: vi.fn().mockReturnValue(vi.fn()),
    handleBlur: vi.fn().mockReturnValue(vi.fn()),
    handleSubmit: vi.fn(),
    reset: vi.fn(),
    setValues: vi.fn(),
    validate: vi.fn(),
    setErrors: vi.fn(),
    setTouched: vi.fn(),
    setIsSubmitting: vi.fn(),
  }),
  usePhrases: () => ({
    createPhrase: vi.fn(),
  }),
}));

vi.mock("@/utils/constants", () => ({
  LIMITS: {
    MAX_PHRASE_LENGTH: 280,
    MIN_PHRASE_LENGTH: 3,
  },
}));

describe("PhraseForm", () => {
  it("should render all form fields", () => {
    render(<PhraseForm />);

    expect(screen.getByLabelText(/frase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/etiquetas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/autor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<PhraseForm />);

    const submitButton = screen.getByRole("button", { name: /agregar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled(); // Should be disabled with empty form
  });

  it("should show initial character count", () => {
    render(<PhraseForm />);

    expect(screen.getByText("0/280")).toBeInTheDocument();
  });

  it("should have proper input attributes", () => {
    render(<PhraseForm />);

    const textInput = screen.getByLabelText(/frase/i);
    expect(textInput).toHaveAttribute("aria-required", "true");
    expect(textInput).toHaveAttribute(
      "placeholder",
      "Escribe una nueva frase...",
    );

    const tagsInput = screen.getByLabelText(/etiquetas/i);
    expect(tagsInput).toHaveAttribute("placeholder", "Separadas por coma");
  });
});
