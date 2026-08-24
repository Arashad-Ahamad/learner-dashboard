import React from "react";

interface QuizLoadErrorProps {
  onRetry: () => void;
  error?: string; // Optional custom error message
}

/**
 * Shown when the quiz question fetch fails or times out (e.g. dropped on a
 * slow/unstable connection). Gives the learner a way forward instead of a
 * dead skeleton or a blank screen.
 *
 * Accessibility features:
 * - role="alert" for screen reader announcements
 * - Focus management - retry button receives focus automatically
 * - ARIA labels for error context
 */
const QuizLoadError: React.FC<QuizLoadErrorProps> = ({
  onRetry,
  error = "We couldn't load the quiz. Check your connection and try again.",
}) => {
  // Handle keyboard activation (Enter/Space) on the container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRetry();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="bg-white p-6 rounded-xl shadow-lg text-center border-2 border-red-200"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Error icon for visual indication */}
        <div className="text-4xl mb-3" aria-hidden="true">
          ⚠️
        </div>

        <p className="text-gray-700 font-medium mb-4">{error}</p>

        {/* Additional helpful message */}
        <p className="text-sm text-gray-500 mb-4">
          This could be due to a slow network connection or server issues.
        </p>

        <button
          onClick={onRetry}
          onKeyDown={handleKeyDown}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors font-medium 
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                     focus-visible:ring-blue-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Retry loading quiz questions"
          autoFocus // Automatically focus the retry button for keyboard users
        >
          🔄 Retry
        </button>

        {/* Hidden announcement for screen readers */}
        <span className="sr-only" role="status" aria-live="polite">
          Click retry to attempt loading the quiz again
        </span>
      </div>
    </div>
  );
};

export default QuizLoadError;
