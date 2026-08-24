import { useCallback, useState, useEffect } from "react";
import {
  LearnerProgressBadge,
  Quiz,
  QuizSkeleton,
  QuizLoadError,
} from "./components";
import { quizQuestions } from "./data/quizData";
import { useQuizQuestions } from "./hooks/useQuizQuestions";
import type { QuizQuestion, QuizResult } from "./types";

// Stand-in for a real API call. Resolves the statically-bundled question set
// after a short simulated delay so the loading skeleton has something to do.
// Swap this for a real `fetch(...)` when a questions endpoint exists.
function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(quizQuestions), 400);
  });
}

function App() {
  const { status, data, retry } = useQuizQuestions(fetchQuizQuestions);
  const [quizKey, setQuizKey] = useState(0); // For resetting quiz

  const handleQuizComplete = useCallback((results: QuizResult) => {
    // Only aggregate counts are logged, and only in dev builds — no learner
    // identifiers, answer content, or telemetry payloads reach the console
    // in production.
    if (import.meta.env.DEV) {
      console.log("Quiz Results:", results);
    }

    // Optional: Show a success message or trigger analytics
    // You could also trigger a confetti effect or celebration here
  }, []);

  // Handle retry with a key reset to force re-render of quiz
  const handleRetry = useCallback(() => {
    retry();
    setQuizKey((prev) => prev + 1); // Force re-render of quiz
  }, [retry]);

  // Accessibility: Announce status changes to screen readers
  useEffect(() => {
    const statusMap = {
      loading: "Loading quiz questions...",
      success: "Quiz loaded successfully!",
      error: "Failed to load quiz. Please try again.",
    };

    if (status !== "loading") {
      // Announce status change to screen readers
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = statusMap[status] || "";
      document.body.appendChild(announcement);

      // Clean up after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 3000);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Learner Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Track your progress and test your knowledge
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column: Progress Badges */}
          <section aria-labelledby="progress-heading">
            <h2
              id="progress-heading"
              className="text-lg sm:text-xl font-semibold text-gray-700 mb-4"
            >
              Your Progress
            </h2>
            <div className="space-y-4" role="list">
              <div role="listitem">
                <LearnerProgressBadge
                  status="default"
                  title="Getting Started with React"
                  progress={0}
                  onClick={() => alert("Start this course")}
                />
              </div>
              <div role="listitem">
                <LearnerProgressBadge
                  status="in-progress"
                  title="JavaScript Fundamentals"
                  progress={65}
                  onClick={() => alert("65% complete")}
                />
              </div>
              <div role="listitem">
                <LearnerProgressBadge
                  status="completed"
                  title="CSS Mastery Course"
                  progress={100}
                  onClick={() => alert("Course completed")}
                />
              </div>
              <div role="listitem">
                <LearnerProgressBadge
                  status="disabled"
                  title="Advanced TypeScript"
                  progress={30}
                />
              </div>
            </div>
          </section>

          {/* Right Column: Quiz */}
          <section aria-labelledby="quiz-heading">
            <h2
              id="quiz-heading"
              className="text-lg sm:text-xl font-semibold text-gray-700 mb-4"
            >
              Quick Quiz
            </h2>

            {/* Error Boundary Fallback */}
            {status === "error" && (
              <QuizLoadError
                onRetry={handleRetry}
                error="Unable to load quiz. Please check your connection and try again."
              />
            )}

            {/* Loading State */}
            {status === "loading" && <QuizSkeleton />}

            {/* Success State */}
            {status === "success" && data && (
              <Quiz
                key={quizKey} // Force re-render on retry
                questions={data}
                onComplete={handleQuizComplete}
              />
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
          <p>&copy; 2026 Learner Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
