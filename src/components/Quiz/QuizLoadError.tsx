interface QuizLoadErrorProps {
  onRetry: () => void;
}

// Shown when the quiz question fetch fails or times out (e.g. dropped on a
// slow/unstable connection). Gives the learner a way forward instead of a
// dead skeleton or a blank screen.
const QuizLoadError: React.FC<QuizLoadErrorProps> = ({ onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="bg-white p-6 rounded-xl shadow-lg text-center"
        role="alert"
      >
        <p className="text-gray-700 font-medium mb-4">
          We couldn't load the quiz. Check your connection and try again.
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default QuizLoadError;
