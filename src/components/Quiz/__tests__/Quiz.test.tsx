import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from '../Quiz';
import type { QuizQuestion } from '../../../types';

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'What color is the sky?',
    options: ['Blue', 'Green', 'Red', 'Purple'],
    correctAnswer: 0,
  },
  {
    id: 'q2',
    text: 'What color is grass?',
    options: ['Green', 'Blue', 'Red', 'Purple'],
    correctAnswer: 0,
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('Quiz', () => {
  it('renders the current question as a radiogroup labelled by the question text', () => {
    render(<Quiz questions={questions} />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAccessibleName('What color is the sky?');
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('marks an option as checked on click, and only one option at a time', async () => {
    const user = userEvent.setup();
    render(<Quiz questions={questions} />);

    await user.click(screen.getByRole('radio', { name: /Blue/ }));
    expect(screen.getByRole('radio', { name: /Blue/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Green/ })).toHaveAttribute('aria-checked', 'false');

    await user.click(screen.getByRole('radio', { name: /Green/ }));
    expect(screen.getByRole('radio', { name: /Blue/ })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /Green/ })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves selection between options with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Quiz questions={questions} />);

    const blue = screen.getByRole('radio', { name: /Blue/ });
    blue.focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('radio', { name: /Green/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Green/ })).toHaveFocus();
  });

  it('blocks submission with an alert when questions are unanswered', async () => {
    const user = userEvent.setup();
    render(<Quiz questions={questions} />);

    await user.click(screen.getByRole('button', { name: 'Submit quiz' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Please answer all questions! (2 remaining)');
    expect(screen.queryByText('Quiz Results')).not.toBeInTheDocument();
  });

  it('completes the quiz and reports the correct score via onComplete', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<Quiz questions={questions} onComplete={onComplete} />);

    await user.click(screen.getByRole('radio', { name: 'Blue' }));
    await user.click(screen.getByRole('button', { name: 'Next question' }));
    await user.click(screen.getByRole('radio', { name: 'Green' }));
    await user.click(screen.getByRole('button', { name: 'Submit quiz' }));

    expect(window.confirm).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith({ correct: 2, total: 2 });
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
  });

  it('does not submit if the user cancels the confirmation dialog', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<Quiz questions={questions} onComplete={onComplete} />);

    await user.click(screen.getByRole('radio', { name: 'Blue' }));
    await user.click(screen.getByRole('button', { name: 'Next question' }));
    await user.click(screen.getByRole('radio', { name: 'Green' }));
    await user.click(screen.getByRole('button', { name: 'Submit quiz' }));

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.queryByText('Quiz Results')).not.toBeInTheDocument();
  });
});
