import { Question } from '@/types/question';
import { User } from '@/types/user';

export interface QuizConfigs {
  startTime?: number | string;
  endTime?: number | string;
  quizType: string;
  resultVisible: boolean;
  multipleAttempts: boolean;
  assignTo: Array<string | User>;
}

export interface QuizBase {
  _id?: string;
  title: string;
  questions: Array<Question>;
  owner: string;
  deleted: boolean;
  createdIn: string;
  createdAt: number;
  updatedAt: number;
  __v: number;
}

export type Quiz = QuizBase & QuizConfigs;
