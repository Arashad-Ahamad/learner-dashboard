import type { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "Which method adds an element to the end of an array in JavaScript?",
    options: [
      "array.push()",
      "array.pop()",
      "array.shift()",
      "array.unshift()",
    ],
    correctAnswer: 0,
  },
  {
    id: "q2",
    text: "What does useState return in React functional components?",
    options: [
      "An array with current state and setter function",
      "An object with state properties",
      "A single value only",
      "A callback function",
    ],
    correctAnswer: 0,
  },
  {
    id: "q3",
    text: "Which CSS approach is best for creating responsive layouts?",
    options: [
      "CSS Grid and Flexbox",
      "HTML Tables",
      "Absolute Positioning",
      "CSS Floats",
    ],
    correctAnswer: 0,
  },
  {
    id: "q4",
    text: "Which React hook is used for side effects and data fetching?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 0,
  },
  {
    id: "q5",
    text: "What is the correct way to update state in React?",
    options: [
      "Using the setState function from useState",
      "Direct assignment to variable",
      "Using var keyword",
      "Using let keyword",
    ],
    correctAnswer: 0,
  },
];
