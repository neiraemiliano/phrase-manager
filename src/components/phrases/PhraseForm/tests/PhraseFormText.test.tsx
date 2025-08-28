import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhraseFormText } from "../PhraseFormText";
import { TextProvider } from "@/contexts/TextContext";

// Mock translations
const mockTranslations = {
  "form.fields.text": "Phrase",
  "form.placeholders.text": "Write a new phrase...",
  "form.characterCount": "{{current}}/{{max}}",
};

// Mock form object
const createMockForm = (values = {}, errors = {}, touched = {}) => ({
  values: { text: "", ...values },
  errors: { ...errors },
  touched: { ...touched },
  handleChange: vi.fn().mockReturnValue(vi.fn()),
  handleBlur: vi.fn().mockReturnValue(vi.fn()),
});

// Mock TextContext
vi.mock("@/contexts/TextContext", () => ({
  TextProvider: ({ children }: { children: React.ReactNode }) => children,
  useText: () => ({
    t: (key: string, params?: Record<string, any>) => {
      let text = mockTranslations[key as keyof typeof mockTranslations] || key;
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(`{{${param}}}`, String(value));
        });
      }
      return text;
    },
    locale: "en",
    setLocale: vi.fn(),
    texts: mockTranslations,
  }),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TextProvider>{children}</TextProvider>
);

describe("PhraseFormText", () => {
  const user = userEvent.setup();

  it("renders textarea with correct attributes", () => {
    const mockForm = createMockForm();
    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByLabelText(/phrase/i);

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("id", "text");
    expect(textarea).toHaveAttribute("name", "text");
    expect(textarea).toHaveAttribute("rows", "3");
    expect(textarea).toHaveAttribute("aria-required", "true");
    expect(textarea).toHaveAttribute("placeholder", "Write a new phrase...");
  });

  it("displays current text value", () => {
    const mockForm = createMockForm({ text: "Hello world" });
    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByDisplayValue("Hello world");
    expect(textarea).toBeInTheDocument();
  });

  it("shows character count", () => {
    const mockForm = createMockForm({ text: "Hello" });
    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    expect(screen.getByText("5/500")).toBeInTheDocument();
  });

  it("shows error state when field has error and is touched", () => {
    const mockForm = createMockForm(
      { text: "Hi" },
      { text: "Text is too short" },
      { text: true },
    );
    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByLabelText(/phrase/i);

    // Should have error styling
    expect(textarea).toHaveClass("border-red-500");
    expect(textarea).toHaveAttribute("aria-invalid", "true");

    // Should show error message
    expect(screen.getByText("Text is too short")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not show error when field is not touched", () => {
    const mockForm = createMockForm(
      { text: "Hi" },
      { text: "Text is too short" },
      { text: false },
    );
    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByLabelText(/phrase/i);

    // Should not have error styling
    expect(textarea).not.toHaveClass("border-red-500");
    expect(textarea).toHaveAttribute("aria-invalid", "false");

    // Should not show error message
    expect(screen.queryByText("Text is too short")).not.toBeInTheDocument();
  });

  it("calls handleChange when text is typed", async () => {
    const mockForm = createMockForm();
    const handleChange = vi.fn(() => () => {});
    mockForm.handleChange = handleChange;

    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByLabelText(/phrase/i);
    await user.type(textarea, "New text");

    expect(handleChange).toHaveBeenCalledWith("text");
  });

  it("calls handleBlur when field loses focus", async () => {
    const mockForm = createMockForm();
    const handleBlur = vi.fn(() => () => {});
    mockForm.handleBlur = handleBlur;

    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByLabelText(/phrase/i);
    await user.click(textarea);
    await user.tab(); // Blur the field

    expect(handleBlur).toHaveBeenCalledWith("text");
  });

  it("has responsive design classes", () => {
    const mockForm = createMockForm();
    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByLabelText(/phrase/i);

    // Should have responsive padding
    expect(textarea).toHaveClass("px-3", "sm:px-4", "py-2", "sm:py-3");

    // Should have responsive text size
    expect(textarea).toHaveClass("text-sm", "sm:text-base");

    // Should prevent resize on mobile
    expect(textarea).toHaveClass("resize-none");
  });

  it("has proper accessibility attributes", () => {
    const mockForm = createMockForm(
      { text: "Test" },
      { text: "Error message" },
      { text: true },
    );
    render(<PhraseFormText form={mockForm} />, { wrapper: TestWrapper });

    const textarea = screen.getByLabelText(/phrase/i);

    expect(textarea).toHaveAttribute(
      "aria-describedby",
      "text-error text-help",
    );
    expect(textarea).toHaveAttribute("aria-invalid", "true");

    // Error message should have proper ARIA attributes
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveAttribute("aria-live", "polite");
  });

  it("forwards ref correctly", () => {
    const mockForm = createMockForm();
    const ref = { current: null };

    render(<PhraseFormText form={mockForm} ref={ref} />, {
      wrapper: TestWrapper,
    });

    // Ref should be attached to textarea
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
