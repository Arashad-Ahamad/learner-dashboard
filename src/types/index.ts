export type BadgeStatus = "default" | "in-progress" | "completed" | "disabled";

export interface LearnerProgressBadgeProps {
  status?: BadgeStatus;
  title?: string;
  progress?: number;
  onClick?: () => void;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  correct: number;
  total: number;
}

export interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (result: QuizResult) => void;
}

//  Ticket #2 - Quiz History
export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
}
