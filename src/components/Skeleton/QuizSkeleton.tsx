import React from "react";

/**
 * Skeleton matches the real Quiz card's layout (badge + header + progress bar
 * + question + 4 options + nav row) so there is no layout shift once real
 * content swaps in — required by the Slow-3G hardening checklist.
 *
 * Accessibility features:
 * - role="status" for screen reader announcements
 * - aria-label="Loading quiz" for context
 * - aria-busy="true" to indicate loading state
 * - Reduced motion support for users with motion sensitivity
 */
const QuizSkeleton: React.FC = () => {
  return (
    <div
      className="max-w-2xl mx-auto"
      role="status"
      aria-label="Loading quiz"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Screen reader announcement */}
      <div className="sr-only">Quiz content is loading, please wait...</div>

      {/* Badge Skeleton - matches LearnerProgressBadge height exactly */}
      <div className="mb-6">
        <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl w-full max-w-md h-[76px] bg-gray-100 animate-pulse">
          {/* Status indicator dot */}
          <div className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0" />

          {/* Content area */}
          <div className="flex-1 min-w-0">
            {/* Title skeleton */}
            <div className="h-5 w-3/4 bg-gray-300 rounded" />

            {/* Progress bar skeleton */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-300 rounded-full">
                <div className="h-full w-2/3 bg-gray-400 rounded-full" />
              </div>
              <div className="h-3 w-8 bg-gray-300 rounded" />
            </div>
          </div>

          {/* Status tag skeleton */}
          <div className="h-6 w-16 bg-gray-300 rounded-full flex-shrink-0" />
        </div>
      </div>

      {/* Quiz Card Skeleton - matches Quiz component exactly */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Progress Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-2 gap-1">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
          <div className="h-full w-1/4 bg-gray-300 rounded-full animate-pulse" />
        </div>

        {/* Question Text */}
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-6 animate-pulse" />

        {/* Options - 4 options matching real quiz */}
        <div className="space-y-3" role="presentation">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 w-full rounded-lg border-2 border-gray-200 bg-gray-100 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-between gap-2 mt-6">
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-2 flex-wrap">
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hidden loading indicator for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Loading quiz content...
      </div>
    </div>
  );
};

export default QuizSkeleton;
