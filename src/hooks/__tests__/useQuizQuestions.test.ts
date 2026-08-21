import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useQuizQuestions } from '../useQuizQuestions';
import type { QuizQuestion } from '../../types';

const sampleQuestions: QuizQuestion[] = [
  { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswer: 0 },
];

describe('useQuizQuestions', () => {
  it('starts in a loading state and transitions to success', async () => {
    const fetcher = vi.fn().mockResolvedValue(sampleQuestions);
    const { result } = renderHook(() => useQuizQuestions(fetcher));

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(sampleQuestions);
  });

  it('transitions to an error state when the fetch rejects', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useQuizQuestions(fetcher));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.data).toBeNull();
  });

  it('retry re-invokes the fetcher and can recover from a prior error', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(sampleQuestions);

    const { result } = renderHook(() => useQuizQuestions(fetcher));
    await waitFor(() => expect(result.current.status).toBe('error'));

    act(() => result.current.retry());
    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result.current.data).toEqual(sampleQuestions);
  });

  it('surfaces an error if the request exceeds the timeout', async () => {
    vi.useFakeTimers();
    const neverResolves = new Promise<QuizQuestion[]>(() => {});
    const fetcher = vi.fn().mockReturnValue(neverResolves);

    const { result } = renderHook(() => useQuizQuestions(fetcher));
    expect(result.current.status).toBe('loading');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_001);
    });

    expect(result.current.status).toBe('error');
    vi.useRealTimers();
  });
});
