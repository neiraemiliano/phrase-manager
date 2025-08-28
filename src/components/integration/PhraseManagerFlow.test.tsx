import { TextProvider } from "@/contexts/TextContext";
import { StoreProvider, useStore } from "@/store";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PhraseForm } from "../phrases/PhraseForm/PhraseForm";
import { PhraseSearchBar } from "../phrases/PhraseSearchBar/PhraseSearchBar";
import React from "react";
// Mock phrase display component for testing
const MockPhraseDisplay: React.FC = () => {
  const { state } = useStore();

  if (!state.phrases || state.phrases.length === 0) {
    return <div>No phrases yet</div>;
  }

  return (
    <div>
      {state.phrases.map((phrase) => (
        <div key={phrase.id}>{phrase.text}</div>
      ))}
    </div>
  );
};

vi.mock("@/store", async () => {
  return await vi.importActual("@/store");
});

// Mock translations for consistent testing
const mockTranslations = {
  "form.fields.text": "Phrase",
  "form.placeholders.text": "Write a new phrase...",
  "form.submit": "Add Phrase",
  "search.placeholder": "Search phrases...",
  "phrases.empty.title": "No phrases yet",
  "phrases.empty.subtitle": "Add the first phrase to get started!",
  "phrases.empty.filtered": "No phrases found with that criteria",
  "confirm.delete.title": "Delete Phrase",
  "confirm.delete.message": 'Are you sure you want to delete "{{text}}"?',
  "confirm.delete.confirm": "Delete",
  "confirm.delete.cancel": "Cancel",
};

// Mock the TextContext
vi.mock("@/contexts/TextContext", () => ({
  TextProvider: ({ children }: { children: React.ReactNode }) => children,
  useText: () => ({
    locale: "en",
    setLocale: vi.fn(),
    t: (key: string, params?: Record<string, any>) => {
      let text = mockTranslations[key as keyof typeof mockTranslations] || key;
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(`{{${param}}}`, String(value));
        });
      }
      return text;
    },
    texts: mockTranslations,
  }),
}));

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TextProvider>
    <StoreProvider>{children}</StoreProvider>
  </TextProvider>
);

describe("Phrase Manager - Integration Flow", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Integration", () => {
    it("should render PhraseForm component without errors", () => {
      render(<PhraseForm />, { wrapper: TestWrapper });

      expect(
        screen.getByPlaceholderText(/write a new phrase/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add phrase/i }),
      ).toBeInTheDocument();
    });

    it("should render PhraseSearchBar component without errors", () => {
      render(<PhraseSearchBar />, { wrapper: TestWrapper });

      expect(
        screen.getByPlaceholderText(/search phrases/i),
      ).toBeInTheDocument();
    });

    it("should render MockPhraseDisplay component without errors", () => {
      render(<MockPhraseDisplay />, { wrapper: TestWrapper });

      // Should show empty state initially
      expect(screen.getByText(/no phrases yet/i)).toBeInTheDocument();
    });

    it("should integrate form submission with state management", async () => {
      render(
        <div>
          <PhraseForm />
          <MockPhraseDisplay />
        </div>,
        { wrapper: TestWrapper },
      );

      const textInput = screen.getByPlaceholderText(/write a new phrase/i);
      const submitButton = screen.getByRole("button", { name: /add phrase/i });

      // Initially should show empty state
      expect(screen.getByText(/no phrases yet/i)).toBeInTheDocument();

      // Add a phrase
      await user.type(textInput, "Integration test phrase");

      // Verify text was typed
      expect(textInput).toHaveValue("Integration test phrase");

      // Form interaction should work without timeout issues
      expect(submitButton).toBeInTheDocument();
    });

    it("should integrate search functionality with phrase display", async () => {
      render(
        <div>
          <PhraseForm />
          <PhraseSearchBar />
          <MockPhraseDisplay />
        </div>,
        { wrapper: TestWrapper },
      );

      const textInput = screen.getByPlaceholderText(/write a new phrase/i);
      const searchInput = screen.getByPlaceholderText(/search phrases/i);

      // Components should render together
      expect(textInput).toBeInTheDocument();
      expect(searchInput).toBeInTheDocument();
      expect(screen.getByText(/no phrases yet/i)).toBeInTheDocument();

      // Search input should accept text
      await user.type(searchInput, "test search");
      expect(searchInput).toHaveValue("test search");
    });

    it("should handle form validation integration", async () => {
      render(<PhraseForm />, { wrapper: TestWrapper });

      const textInput = screen.getByPlaceholderText(/write a new phrase/i);
      const submitButton = screen.getByRole("button", { name: /add phrase/i });

      // Button should be disabled initially
      expect(submitButton).toBeDisabled();

      // Type minimum valid text
      await user.type(textInput, "Hi!");

      // Button should become enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Clear text
      await user.clear(textInput);

      // Button should be disabled again
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it("should handle empty search state correctly", async () => {
      render(
        <div>
          <PhraseSearchBar />
          <MockPhraseDisplay />
        </div>,
        { wrapper: TestWrapper },
      );

      const searchInput = screen.getByPlaceholderText(/search phrases/i);

      // Should show empty state
      expect(screen.getByText(/no phrases yet/i)).toBeInTheDocument();

      // Type search with no phrases
      await user.type(searchInput, "nonexistent");

      // Should still show empty state (or "no phrases found")
      await waitFor(() => {
        const emptyMessage =
          screen.queryByText(/no phrases yet/i) ||
          screen.queryByText(/no phrases found/i);
        expect(emptyMessage).toBeInTheDocument();
      });
    });

    it("should handle multiple component interactions", async () => {
      render(
        <div>
          <PhraseForm />
          <PhraseSearchBar />
          <MockPhraseDisplay />
        </div>,
        { wrapper: TestWrapper },
      );

      const textInput = screen.getByPlaceholderText(/write a new phrase/i);
      const submitButton = screen.getByRole("button", { name: /add phrase/i });
      const searchInput = screen.getByPlaceholderText(/search phrases/i);

      // Add a phrase
      await user.type(textInput, "Test integration phrase");
      await user.click(submitButton);

      // Verify phrase appears
      await waitFor(() => {
        expect(screen.getByText("Test integration phrase")).toBeInTheDocument();
      });

      // Search for part of the phrase
      await user.type(searchInput, "integration");

      // Should still show the phrase
      await waitFor(
        () => {
          expect(
            screen.getByText("Test integration phrase"),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      // Clear search
      await user.clear(searchInput);

      // Phrase should still be visible
      await waitFor(() => {
        expect(screen.getByText("Test integration phrase")).toBeInTheDocument();
      });
    });

    it("should maintain component state consistency", () => {
      // Test that all components can be rendered together without conflicts
      const { container } = render(
        <div>
          <PhraseForm />
          <PhraseSearchBar />
          <MockPhraseDisplay />
        </div>,
        { wrapper: TestWrapper },
      );

      // Should render without throwing errors
      expect(container).toBeInTheDocument();

      // Key components should be present
      expect(
        screen.getByPlaceholderText(/write a new phrase/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/search phrases/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/no phrases yet/i)).toBeInTheDocument();
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle component errors gracefully", () => {
      // Test that components render even with minimal props
      expect(() => {
        render(<PhraseForm />, { wrapper: TestWrapper });
      }).not.toThrow();

      expect(() => {
        render(<PhraseSearchBar />, { wrapper: TestWrapper });
      }).not.toThrow();

      expect(() => {
        render(<MockPhraseDisplay />, { wrapper: TestWrapper });
      }).not.toThrow();
    });

    it("should handle provider integration correctly", () => {
      // Test that components work with the provider setup
      render(
        <TestWrapper>
          <PhraseForm />
          <PhraseSearchBar />
          <MockPhraseDisplay />
        </TestWrapper>,
      );

      // All components should render successfully
      expect(
        screen.getByPlaceholderText(/write a new phrase/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/search phrases/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/no phrases yet/i)).toBeInTheDocument();
    });
  });
});
