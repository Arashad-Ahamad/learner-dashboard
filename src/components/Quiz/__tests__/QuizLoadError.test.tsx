// src/components/Quiz/__tests__/QuizLoadError.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizLoadError from "../QuizLoadError";

describe("QuizLoadError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders error message and retry button", () => {
    render(<QuizLoadError onRetry={() => {}} />);

    // Check alert role
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Check error message
    expect(screen.getByText(/couldn't load the quiz/i)).toBeInTheDocument();

    // Check helpful message
    expect(screen.getByText(/slow network connection/i)).toBeInTheDocument();

    // Check retry button
    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveAttribute(
      "aria-label",
      "Retry loading quiz questions",
    );
  });

  it("displays custom error message when provided", () => {
    const customError = "Custom error message for testing";
    render(<QuizLoadError onRetry={() => {}} error={customError} />);

    expect(screen.getByText(customError)).toBeInTheDocument();
  });

  it("calls onRetry when button is clicked", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<QuizLoadError onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("calls onRetry when Enter key is pressed", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<QuizLoadError onRetry={onRetry} />);

    const container = screen.getByRole("alert").parentElement?.parentElement;
    if (container) {
      container.focus();
      await user.keyboard("{Enter}");
      expect(onRetry).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onRetry when Space key is pressed", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<QuizLoadError onRetry={onRetry} />);

    const container = screen.getByRole("alert").parentElement?.parentElement;
    if (container) {
      container.focus();
      await user.keyboard(" ");
      expect(onRetry).toHaveBeenCalledTimes(1);
    }
  });

  it("auto-focuses the retry button on render", () => {
    render(<QuizLoadError onRetry={() => {}} />);
    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toHaveFocus();
  });

  it("has proper accessibility attributes", () => {
    render(<QuizLoadError onRetry={() => {}} />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "polite");
    expect(alert).toHaveAttribute("aria-atomic", "true");

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toHaveAttribute(
      "aria-label",
      "Retry loading quiz questions",
    );
  });
});
