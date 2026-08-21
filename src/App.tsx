import { useCallback } from 'react';
import { LearnerProgressBadge, Quiz, QuizSkeleton, QuizLoadError } from './components';
import { quizQuestions } from './data/quizData';
import { useQuizQuestions } from './hooks/useQuizQuestions';
import type { QuizQuestion, QuizResult } from './types';

// Stand-in for a real API call. Resolves the statically-bundled question set
// after a short simulated delay so the loading skeleton has something to do.
// Swap this for a real `fetch(...)` when a questions endpoint exists.
function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(quizQuestions), 400);
  });
}

function App() {
  const { status, data, retry } = useQuizQuestions(fetchQuizQuestions);

  const handleQuizComplete = useCallback((results: QuizResult) => {
    // Only aggregate counts are logged, and only in dev builds — no learner
    // identifiers, answer content, or telemetry payloads reach the console
    // in production.
    if (import.meta.env.DEV) {
      console.log('Quiz Results:', results);
    }
  }, []);

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
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Your Progress
            </h2>
            <div className="space-y-4">
              <LearnerProgressBadge
                status="default"
                title="Getting Started with React"
                progress={0}
                onClick={() => alert('Start this course')}
              />
              <LearnerProgressBadge
                status="in-progress"
                title="JavaScript Fundamentals"
                progress={65}
                onClick={() => alert('65% complete')}
              />
              <LearnerProgressBadge
                status="completed"
                title="CSS Mastery Course"
                progress={100}
                onClick={() => alert('Course completed')}
              />
              <LearnerProgressBadge
                status="disabled"
                title="Advanced TypeScript"
                progress={30}
              />
            </div>
          </section>

          {/* Right Column: Quiz */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Quick Quiz
            </h2>
            {status === 'loading' && <QuizSkeleton />}
            {status === 'error' && <QuizLoadError onRetry={retry} />}
            {status === 'success' && data && (
              <Quiz questions={data} onComplete={handleQuizComplete} />
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
        </footer>
      </div>
    </div>
  );
}

export default App;
