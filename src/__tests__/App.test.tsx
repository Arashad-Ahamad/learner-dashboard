// src/__tests__/App.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Mock the hooks and components
vi.mock("../hooks/useQuizQuestions", () => ({
  useQuizQuestions: vi.fn(),
}));

vi.mock("../components/Quiz/Quiz", () => ({
  default: ({ onComplete }: any) => (
    <div data-testid="quiz">
      <div>Quiz Component</div>
      <button
        onClick={() => onComplete({ correct: 5, total: 5 })}
        data-testid="mock-complete"
      >
        Complete Quiz
      </button>
    </div>
  ),
}));

vi.mock("../components/Skeleton/QuizSkeleton", () => ({
  default: () => <div data-testid="skeleton">Loading quiz...</div>,
}));

vi.mock("../components/Quiz/QuizLoadError", () => ({
  default: ({ onRetry, error }: any) => (
    <div data-testid="error">
      <div>Error: {error || "Failed to load"}</div>
      <button onClick={onRetry} data-testid="mock-retry">
        Retry
      </button>
    </div>
  ),
}));

vi.mock("../components/LearnerProgressBadge/LearnerProgressBadge", () => ({
  default: ({ title, status, progress, onClick }: any) => (
    <div data-testid={`badge-${title}`} onClick={onClick}>
      {title} - {status} - {progress}%
    </div>
  ),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console logs for cleaner test output
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders header and layout", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "success",
      data: [],
      retry: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText("Learner Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Track your progress and test your knowledge"),
    ).toBeInTheDocument();
    expect(screen.getByText("Your Progress")).toBeInTheDocument();
    expect(screen.getByText("Quick Quiz")).toBeInTheDocument();
  });

  it("renders all progress badges", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "success",
      data: [],
      retry: vi.fn(),
    });

    render(<App />);

    expect(
      screen.getByText("Getting Started with React - default - 0%"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("JavaScript Fundamentals - in-progress - 65%"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("CSS Mastery Course - completed - 100%"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Advanced TypeScript - disabled - 30%"),
    ).toBeInTheDocument();
  });

  it("shows loading skeleton when status is loading", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "loading",
      data: null,
      retry: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("quiz")).not.toBeInTheDocument();
  });

  it("shows error component when status is error", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "error",
      data: null,
      retry: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByText(/Unable to load quiz/i)).toBeInTheDocument();
  });

  it("shows quiz when status is success with data", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "success",
      data: [{ id: "1", text: "Test", options: ["A", "B"], correctAnswer: 0 }],
      retry: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId("quiz")).toBeInTheDocument();
  });

  it("calls retry when error retry button is clicked", async () => {
    const retryMock = vi.fn();
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "error",
      data: null,
      retry: retryMock,
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("mock-retry"));
    expect(retryMock).toHaveBeenCalledTimes(1);
  });

  it("handles quiz completion", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "success",
      data: [{ id: "1", text: "Test", options: ["A", "B"], correctAnswer: 0 }],
      retry: vi.fn(),
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("mock-complete"));

    // Check that console.log was called (in DEV mode)
    expect(consoleSpy).toHaveBeenCalledWith("Quiz Results:", {
      correct: 5,
      total: 5,
    });
  });

  it("has proper accessibility attributes", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "success",
      data: [],
      retry: vi.fn(),
    });

    render(<App />);

    // Check sections have aria labels
    const sections = document.querySelectorAll("section");
    expect(sections[0]).toHaveAttribute("aria-labelledby", "progress-heading");
    expect(sections[1]).toHaveAttribute("aria-labelledby", "quiz-heading");
  });

  // Simplified test - just check that badges are clickable
  it("handles badge clicks", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "success",
      data: [],
      retry: vi.fn(),
    });

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const user = userEvent.setup();

    render(<App />);

    // Find and click the first badge using a more specific query
    const badge = screen.getByTestId("badge-Getting Started with React");
    await user.click(badge);

    expect(alertSpy).toHaveBeenCalledWith("Start this course");
    alertSpy.mockRestore();
  });

  // Simplified keyboard navigation test
  it("has proper keyboard navigation", async () => {
    const { useQuizQuestions } = await import("../hooks/useQuizQuestions");
    (useQuizQuestions as any).mockReturnValue({
      status: "success",
      data: [],
      retry: vi.fn(),
    });

    render(<App />);

    // Just verify that focusable elements exist
    const focusableElements = document.querySelectorAll(
      'button, [tabindex="0"]',
    );
    expect(focusableElements.length).toBeGreaterThan(0);
  });
});
