import { useState, useRef, useId } from "react";
import type { QuizProps } from "../../types";
import LearnerProgressBadge from "../LearnerProgressBadge/LearnerProgressBadge";

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headingId = useId();
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setError("");
  };

  // Arrow-key navigation within the radiogroup, per WAI-ARIA radio group
  // authoring practice: arrow keys move focus AND selection between options.
  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    questionId: string,
    idx: number,
    optionCount: number,
  ) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextIdx = (idx + 1) % optionCount;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      nextIdx = (idx - 1 + optionCount) % optionCount;
    } else if (e.key === "Home") {
      nextIdx = 0;
    } else if (e.key === "End") {
      nextIdx = optionCount - 1;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      handleAnswer(questionId, nextIdx);
      optionRefs.current[nextIdx]?.focus();
    }
  };

  //  Enhanced validation with double-submission prevention
  const handleSubmit = () => {
    //  Prevent double submission
    if (isSubmitting) return;

    //  Check all questions answered
    const unanswered = questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setError(`Please answer all questions! (${unanswered.length} remaining)`);
      const index = questions.findIndex((q) => answers[q.id] === undefined);
      if (index !== -1) setCurrentQ(index);
      return;
    }

    //  Confirm before submitting
    if (!window.confirm("Are you sure you want to submit the quiz?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      const correct = questions.filter(
        (q) => answers[q.id] === q.correctAnswer,
      ).length;
      setShowResults(true);
      onComplete?.({ correct, total: questions.length });
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ((prev) => prev + 1);
  };

  const goPrev = () => {
    if (currentQ > 0) setCurrentQ((prev) => prev - 1);
  };

  const resetQuiz = () => {
    setShowResults(false);
    setCurrentQ(0);
    setAnswers({});
    setError("");
    setIsSubmitting(false);
  };

  // Calculate progress for badge
  const progress = Math.round(
    (Object.keys(answers).length / questions.length) * 100,
  );

  // Determine status for badge
  const getBadgeStatus = () => {
    if (showResults) return "completed";
    if (Object.keys(answers).length === questions.length) return "completed";
    if (Object.keys(answers).length > 0) return "in-progress";
    return "default";
  };

  // Results Screen
  if (showResults) {
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctAnswer,
    ).length;
    const percentage = Math.round((correct / questions.length) * 100);
    const isPerfect = percentage === 100;
    const isGood = percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto">
        {/*  Badge in results */}
        <div className="mb-6">
          <LearnerProgressBadge
            status="completed"
            title="Quiz Completed"
            progress={100}
          />
        </div>

        <div
          className="bg-white p-6 rounded-xl shadow-lg"
          role="status"
          aria-live="polite"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz Results
          </h2>
          <div className="text-center py-8">
            <div className="text-5xl mb-4" aria-hidden="true">
              {isPerfect ? "⭐" : isGood ? "👍" : "📖"}
            </div>
            <p className="text-xl text-gray-700">
              <span className="font-bold text-blue-600">{correct}</span> out of{" "}
              <span className="font-bold">{questions.length}</span> correct
            </p>
            <div
              className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-3 mt-4"
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Score"
            >
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-gray-600 mt-3 font-medium">
              {isPerfect
                ? "Perfect Score! Excellent work! 🎉"
                : isGood
                  ? "Great job! Keep it up! 💪"
                  : "Keep practicing! You'll improve! 📚"}
            </p>
            <button
              onClick={resetQuiz}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
            >
              Retry Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  // Roving tabindex target: the selected option if there is one, else the first.
  const activeOptionIdx = answers[q.id] ?? 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/*  LearnerProgressBadge Integration */}
      <div className="mb-6">
        <LearnerProgressBadge
          status={getBadgeStatus()}
          title="Quiz Progress"
          progress={progress}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Progress Header */}
        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 mb-2 gap-1">
          <span>
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="font-medium">
            {answeredCount} of {questions.length} answered
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full bg-gray-200 rounded-full h-2 mb-6"
          role="progressbar"
          aria-valuenow={currentQ + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label={`Question ${currentQ + 1} of ${questions.length}`}
        >
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Visually hidden live region: announces question changes to screen readers
            without needing focus to move (SR users navigating by button clicks would
            otherwise get no confirmation the question advanced). */}
        <p className="sr-only" role="status" aria-live="polite">
          Question {currentQ + 1} of {questions.length}: {q.text}
        </p>

        {/* Question */}
        <h3
          id={headingId}
          className="text-lg sm:text-xl font-semibold text-gray-800 mb-6"
        >
          {q.text}
        </h3>

        {/* Options */}
        <div
          className="space-y-3"
          role="radiogroup"
          aria-labelledby={headingId}
        >
          {q.options.map((opt, idx) => {
            const isSelected = answers[q.id] === idx;
            return (
              <button
                key={idx}
                ref={(el) => {
                  optionRefs.current[idx] = el;
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={idx === activeOptionIdx ? 0 : -1}
                className={`
                  w-full text-left p-3 rounded-lg border-2 transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600
                  ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }
                `}
                onClick={() => handleAnswer(q.id, idx)}
                onKeyDown={(e) =>
                  handleOptionKeyDown(e, q.id, idx, q.options.length)
                }
              >
                <span
                  className="font-medium mr-2 text-gray-600"
                  aria-hidden="true"
                >
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-gray-700">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-pulse"
            role="alert"
          >
            <span aria-hidden="true">⚠️ </span>
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-between gap-2 mt-6">
          <button
            onClick={goPrev}
            disabled={currentQ === 0}
            aria-label="Previous question"
            className={`
              px-4 py-2 rounded-lg transition-colors font-medium
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500
              ${
                currentQ === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }
            `}
          >
            ← Previous
          </button>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={goNext}
              disabled={currentQ === questions.length - 1}
              aria-label="Next question"
              className={`
                px-4 py-2 rounded-lg transition-colors font-medium
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500
                ${
                  currentQ === questions.length - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }
              `}
            >
              Next →
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-label="Submit quiz"
              className={`
                px-6 py-2 rounded-lg transition-colors font-medium
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
              `}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
