import React from 'react';
import type { QuizAttempt } from '../../types';

interface QuizHistoryProps {
  attempts: QuizAttempt[];
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ attempts }) => {
  const getMessage = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good Job';
    if (percentage >= 40) return 'Keep Going';
    return 'Try Again';
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg max-w-md">
      <h2 className="text-lg font-bold mb-3">Your Quiz History</h2>
      {attempts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No attempts yet. Take a quiz!</p>
      ) : (
        <div className="space-y-2">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="flex justify-between items-center border-b border-gray-100 py-3"
            >
              <span className="text-gray-600 text-sm">{attempt.date}</span>
              <span className="font-semibold">
                {attempt.score}/{attempt.total}
              </span>
              <span className={`font-semibold ${
                attempt.percentage >= 80 ? 'text-green-600' :
                attempt.percentage >= 60 ? 'text-blue-600' :
                attempt.percentage >= 40 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {attempt.percentage}%
              </span>
              <span className="text-sm text-gray-500">
                {getMessage(attempt.percentage)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;