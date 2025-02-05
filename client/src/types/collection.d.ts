import { Question } from '@/types/question';

export interface Collection {
  _id: string;
  title: string;
  questions: [Question];
  owner: string;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
  __v: number;
}
