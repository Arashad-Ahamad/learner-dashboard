import { useCallback, useState, useEffect } from "react";
import {
  LearnerProgressBadge,
  Quiz,
  QuizSkeleton,
  QuizLoadError,
  QuizHistory,
} from "./components";
import { quizQuestions } from "./data/quizData";
import { useQuizQuestions } from "./hooks/useQuizQuestions";
import type { QuizQuestion, QuizResult, QuizAttempt } from "./types";

// Stand-in for a real API call
function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(quizQuestions), 400);
  });
}

function App() {
  const { status, data, retry } = useQuizQuestions(fetchQuizQuestions);
  const [quizKey, setQuizKey] = useState(0);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const handleQuizComplete = useCallback((results: QuizResult) => {
    if (import.meta.env.DEV) {
      console.log("Quiz Results:", results);
    }

    // Quiz complete hone par history mein add
    const newAttempt: QuizAttempt = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      score: results.correct,
      total: results.total,
      percentage: Math.round((results.correct / results.total) * 100),
    };

    setAttempts((prev) => [newAttempt, ...prev]);
  }, []);

  const handleRetry = useCallback(() => {
    retry();
    setQuizKey((prev) => prev + 1);
  }, [retry]);

  useEffect(() => {
    const statusMap = {
      loading: "Loading quiz questions...",
      success: "Quiz loaded successfully!",
      error: "Failed to load quiz. Please try again.",
    };

    if (status !== "loading") {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = statusMap[status] || "";
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 3000);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Learner Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Track your progress and test your knowledge
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column: Progress Badges + History */}
          <section aria-labelledby="progress-heading">
            <h2 id="progress-heading" className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
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

            {/*  QUIZ HISTORY */}
            <div className="mt-6">
              <QuizHistory attempts={attempts} />
            </div>
          </section>

          {/* Right Column: Quiz */}
          <section aria-labelledby="quiz-heading">
            <h2 id="quiz-heading" className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Quick Quiz
            </h2>

            {status === "error" && (
              <QuizLoadError
                onRetry={handleRetry}
                error="Unable to load quiz. Please check your connection and try again."
              />
            )}

            {status === "loading" && <QuizSkeleton />}

            {status === "success" && data && (
              <Quiz
                key={quizKey}
                questions={data}
                onComplete={handleQuizComplete}
              />
            )}
          </section>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
          <p>&copy; 2026 Learner Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;