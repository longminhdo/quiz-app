import { Question } from '@/types/question';

export interface QuizConfigs {
  startTime?: string;
  endTime?: string;
  duration?: number;
  quizType: string;
  resultVisible: boolean;
  multipleAttempts: boolean;
  assignTo: Array<string>;
  acceptingResponse: boolean;
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
