import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button/Button";
import { Plus } from "lucide-react";
import React from "react";

vi.mock("@/contexts/TextContext", () => ({
  TextProvider: ({ children }: { children: React.ReactNode }) => children,
  useText: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "common.loading": "Cargando...",
      };
      return translations[key] || key;
    },
    language: "es",
    setLanguage: vi.fn(),
  }),
}));

describe("Button", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should apply size classes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small")).toHaveClass("text-sm");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large")).toHaveClass("text-base");
  });

  it("should render with icons", () => {
    render(
      <Button
        leftIcon={<Plus data-testid="left-icon" />}
        rightIcon={<Plus data-testid="right-icon" />}
      >
        With Icons
      </Button>,
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(<Button isLoading>Loading</Button>);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when specified", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should not trigger click when loading", () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Loading Button
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render ghost variant correctly", () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    expect(screen.getByText("Ghost Button")).toHaveClass("text-gray-600");
  });

  it("should render secondary variant correctly", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    expect(screen.getByText("Secondary Button")).toHaveClass("bg-gray-600");
  });
});
