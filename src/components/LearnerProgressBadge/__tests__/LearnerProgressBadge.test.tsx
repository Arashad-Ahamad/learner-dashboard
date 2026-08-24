import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LearnerProgressBadge from "../LearnerProgressBadge";

describe("LearnerProgressBadge", () => {
  it("exposes an accessible name including title, status, and progress", () => {
    render(
      <LearnerProgressBadge
        status="in-progress"
        title="JavaScript Fundamentals"
        progress={65}
      />,
    );
    expect(
      screen.getByRole("button", {
        name: "JavaScript Fundamentals, In Progress, 65% complete",
      }),
    ).toBeInTheDocument();
  });

  it("calls onClick when activated with the mouse", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LearnerProgressBadge title="Course" progress={0} onClick={onClick} />,
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick on Enter and Space (keyboard activation)", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LearnerProgressBadge title="Course" progress={0} onClick={onClick} />,
    );

    const badge = screen.getByRole("button");
    badge.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is not focusable or clickable when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LearnerProgressBadge
        status="disabled"
        title="Locked Course"
        progress={30}
        onClick={onClick}
      />,
    );

    const badge = screen.getByRole("button");
    expect(badge).toHaveAttribute("tabindex", "-1");
    expect(badge).toHaveAttribute("aria-disabled", "true");

    await user.click(badge);
    expect(onClick).not.toHaveBeenCalled();
  });

  //  FIXED: This test now uses querySelector since progressbar is nested inside a button
  it("exposes progress via a progressbar role with correct bounds", () => {
    render(<LearnerProgressBadge title="Course" progress={42} />);
    // Use querySelector to find the progressbar since it's nested inside a button
    const progressbar = document.querySelector('[role="progressbar"]');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-valuenow", "42");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps the visual fill width for out-of-range progress values", () => {
    const { container } = render(
      <LearnerProgressBadge title="Course" progress={150} />,
    );
    // The inner fill bar's inline width style must be clamped to 100%,
    // even though 150 is echoed verbatim to aria-valuenow above.
    const fillBar = Array.from(
      container.querySelectorAll<HTMLElement>("[style]"),
    ).find((el) => el.style.width && el.style.backgroundColor);
    expect(fillBar?.style.width).toBe("100%");
  });
});
