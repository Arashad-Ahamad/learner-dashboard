import { colors, typography, borderRadius } from "../../tokens/designTokens";
import type { LearnerProgressBadgeProps, BadgeStatus } from "../../types";

interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  progress: string;
  label: string;
}

const statusStyles: Record<BadgeStatus, StatusStyle> = {
  default: {
    bg: colors.surface.light,
    text: colors.text.primary,
    border: colors.surface.border,
    progress: colors.brand.primary,
    label: "Not Started",
  },
  "in-progress": {
    bg: colors.status.inProgressBg,
    // Was colors.status.inProgress (1.93:1 on the tinted bg) — swapped to a
    // darker accessible token. `progress`/`border` stay vivid since those are
    // decorative (progress fill, border), not text.
    text: colors.status.inProgressText,
    border: colors.status.inProgress,
    progress: colors.status.inProgress,
    label: "In Progress",
  },
  completed: {
    bg: colors.status.completedBg,
    text: colors.status.completedText,
    border: colors.status.completed,
    progress: colors.status.completed,
    label: "Completed",
  },
  disabled: {
    bg: colors.status.disabledBg,
    text: colors.status.disabledText,
    border: colors.status.disabled,
    progress: colors.status.disabled,
    label: "Locked",
  },
};

const LearnerProgressBadge: React.FC<LearnerProgressBadgeProps> = ({
  status = "default",
  title = "Course",
  progress = 0,
  onClick,
}) => {
  const style = statusStyles[status];
  const isDisabled = status === "disabled";

  return (
    <div
      className={`
        flex items-center gap-3 p-4 border-2
        transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg hover:scale-[1.02] cursor-pointer"}
        w-full max-w-md
      `}
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        borderRadius: borderRadius.lg,
      }}
      onClick={isDisabled ? undefined : onClick}
      role="button"
      aria-disabled={isDisabled}
      aria-label={`${title}, ${style.label}, ${Math.round(progress)}% complete`}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Status Indicator (decorative — status is already conveyed via the tag text and aria-label) */}
      <div
        aria-hidden="true"
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: style.text }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0" aria-hidden="true">
        <div
          className="font-semibold truncate"
          style={{
            fontSize: typography.heading.fontSize,
            lineHeight: typography.heading.lineHeight,
            fontWeight: typography.heading.fontWeight,
            color: colors.text.primary,
          }}
        >
          {title}
        </div>

        {/* Progress Bar */}
        <div
          className="mt-2 flex items-center gap-2"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                backgroundColor: style.progress,
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: style.text }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Status Tag (visual only — name already exposed via aria-label above) */}
      <div
        aria-hidden="true"
        className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0"
        style={{
          backgroundColor: style.text + "20",
          color: style.text,
          borderRadius: borderRadius.full,
        }}
      >
        {style.label}
      </div>
    </div>
  );
};

export default LearnerProgressBadge;
