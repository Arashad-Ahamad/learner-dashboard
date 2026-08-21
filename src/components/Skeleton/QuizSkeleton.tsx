// Skeleton matches the real Quiz card's layout (badge + header + progress bar
// + question + 4 options + nav row) so there is no layout shift once real
// content swaps in — required by the Slow-3G hardening checklist.
const QuizSkeleton: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto" role="status" aria-label="Loading quiz">
      <div className="mb-6 h-[76px] w-full max-w-md rounded-xl bg-gray-200 animate-pulse" />

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between mb-2">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="h-2 w-full bg-gray-200 rounded-full mb-6 animate-pulse" />

        <div className="h-6 w-3/4 bg-gray-200 rounded mb-6 animate-pulse" />

        <div className="space-y-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-12 w-full rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default QuizSkeleton;
