import { Question } from '@/types/question';
import { Quiz } from '@/types/quiz';

export interface CompletedQuestion {
  question: string;
  response?: Array<string>;
  correct?: boolean;
}

export interface QuizAttempt {
  _id?: string;
  quiz: Quiz;
  shuffledQuestions?: Array<Question>;
  completedQuestions?: Array<CompletedQuestion>;
  owner: string;
  grade: number;
  submitted: boolean;
  deleted: boolean;
  endedAt: number;
  createdAt: number;
  updatedAt: number;
  __v: number;
}
