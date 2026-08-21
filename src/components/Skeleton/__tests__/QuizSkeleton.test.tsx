// src/components/Skeleton/__tests__/QuizSkeleton.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import QuizSkeleton from "../QuizSkeleton";

describe("QuizSkeleton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with loading status role", () => {
    render(<QuizSkeleton />);
    const statusElement = screen.getByRole("status");
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveAttribute("aria-label", "Loading quiz");
    expect(statusElement).toHaveAttribute("aria-busy", "true");
    expect(statusElement).toHaveAttribute("aria-live", "polite");
  });

  it("renders all skeleton placeholder elements", () => {
    const { container } = render(<QuizSkeleton />);

    // Check for pulse animations
    const animatedElements = container.querySelectorAll(".animate-pulse");
    expect(animatedElements.length).toBeGreaterThan(5);
  });

  it("renders badge skeleton with correct structure", () => {
    const { container } = render(<QuizSkeleton />);

    // Badge skeleton should have border and rounded-xl
    const badgeSkeleton = container.querySelector(
      ".border-2.border-gray-200.rounded-xl",
    );
    expect(badgeSkeleton).toBeInTheDocument();
    expect(badgeSkeleton).toHaveClass("h-[76px]");
  });

  it("renders 4 option skeletons with staggered animation delays", () => {
    const { container } = render(<QuizSkeleton />);

    const optionSkeletons = container.querySelectorAll(".space-y-3 > div");
    expect(optionSkeletons).toHaveLength(4);

    // Check for staggered delays
    optionSkeletons.forEach((el, index) => {
      expect(el).toHaveStyle({ animationDelay: `${index * 0.1}s` });
    });
  });

  it("renders navigation button skeletons", () => {
    const { container } = render(<QuizSkeleton />);

    const navButtons = container.querySelectorAll(
      ".flex-wrap.justify-between .h-10",
    );
    expect(navButtons.length).toBeGreaterThanOrEqual(3); // Previous + Next + Submit
  });

  it("has hidden screen reader announcements", () => {
    render(<QuizSkeleton />);

    const srOnlyElements = document.querySelectorAll(".sr-only");
    expect(srOnlyElements.length).toBeGreaterThan(0);

    // Check for loading announcement
    expect(screen.getByText(/Quiz content is loading/i)).toBeInTheDocument();
  });

  it("matches the layout of actual Quiz component", () => {
    const { container } = render(<QuizSkeleton />);

    // Should have max-w-2xl mx-auto wrapper
    const wrapper = container.querySelector(".max-w-2xl.mx-auto");
    expect(wrapper).toBeInTheDocument();

    // Should have shadow-lg card
    const card = container.querySelector(".shadow-lg");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("bg-white", "p-6", "rounded-xl");
  });

  it("renders progress bar with partial fill", () => {
    const { container } = render(<QuizSkeleton />);

    const progressBar = container.querySelector(
      ".h-2.w-full.bg-gray-200.rounded-full",
    );
    expect(progressBar).toBeInTheDocument();

    const progressFill = progressBar?.querySelector(".h-full");
    expect(progressFill).toHaveClass("w-1/4");
  });
});
