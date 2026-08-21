import { useCallback, useEffect, useState } from 'react';
import type { QuizQuestion } from '../types';

type LoadStatus = 'loading' | 'success' | 'error';

interface UseQuizQuestionsResult {
  status: LoadStatus;
  data: QuizQuestion[] | null;
  retry: () => void;
}

// Requests that hang indefinitely on a slow connection must not leave the
// learner staring at a skeleton forever — bail out and show a retry action.
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Loads quiz questions asynchronously so the UI can show a loading skeleton
 * and a retry affordance under real network conditions (e.g. Slow 3G),
 * instead of assuming data is always available synchronously.
 *
 * `fetcher` defaults to resolving the statically-bundled question set, but
 * accepts an injected function so this is easy to unit test (success, error,
 * and timeout paths) without touching real timers everywhere.
 */
export function useQuizQuestions(
  fetcher: () => Promise<QuizQuestion[]>
): UseQuizQuestionsResult {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [data, setData] = useState<QuizQuestion[] | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setStatus('loading');
    setData(null);
    setAttempt(a => a + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), REQUEST_TIMEOUT_MS);
    });

    Promise.race([fetcher(), timeout])
      .then(questions => {
        if (cancelled) return;
        setData(questions);
        setStatus('success');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return { status, data, retry };
}
