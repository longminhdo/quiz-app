import { Question } from '@/types/question';
import { Quiz } from '@/types/quiz';
import { QuizAttempt } from '@/types/quizAttempt';

export interface UserQuiz {
  _id?: string;
  owner: string;
  quiz: Quiz;
  type: string;
  shuffledQuestions: Array<Question>;
  currentAttempt?: QuizAttempt;
  status: string;
  attempts: Array<QuizAttempt>;
  grade: number;
  assigned: boolean;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
  __v: number;
}
