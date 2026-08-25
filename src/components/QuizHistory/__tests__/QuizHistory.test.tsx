import { render, screen } from "@testing-library/react";
import QuizHistory from "../QuizHistory";

describe("QuizHistory", () => {
  
  it('shows "No attempts yet. Take a quiz!" when empty', () => {
    render(<QuizHistory attempts={[]} />);
    expect(screen.getByText("No attempts yet. Take a quiz!")).toBeInTheDocument();
  });

  it('renders attempts with correct score, percentage, date and message', () => {
    const attempts = [
      { id: '1', date: 'Aug 25, 2026', score: 4, total: 5, percentage: 80 },
    ];
    render(<QuizHistory attempts={attempts} />);
    
    expect(screen.getByText("Aug 25, 2026")).toBeInTheDocument();
    expect(screen.getByText("4/5")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it('shows "Excellent" for 80% or above', () => {
    const attempts = [
      { id: '1', date: 'Aug 25, 2026', score: 4, total: 5, percentage: 80 },
    ];
    render(<QuizHistory attempts={attempts} />);
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it('shows "Good Job" for 60-79%', () => {
    const attempts = [
      { id: '1', date: 'Aug 25, 2026', score: 3, total: 5, percentage: 60 },
    ];
    render(<QuizHistory attempts={attempts} />);
    expect(screen.getByText("Good Job")).toBeInTheDocument();
  });

  it('shows "Keep Going" for 40-59%', () => {
    const attempts = [
      { id: '1', date: 'Aug 25, 2026', score: 2, total: 5, percentage: 40 },
    ];
    render(<QuizHistory attempts={attempts} />);
    expect(screen.getByText("Keep Going")).toBeInTheDocument();
  });

  it('shows "Try Again" for below 40%', () => {
    const attempts = [
      { id: '1', date: 'Aug 25, 2026', score: 1, total: 5, percentage: 20 },
    ];
    render(<QuizHistory attempts={attempts} />);
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

});