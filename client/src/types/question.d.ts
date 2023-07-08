import { Media } from '@/types/media';
import { Option } from '@/types/option';

export interface Question {
  _id: string;
  title: string;
  options: Array<Option>;
  keys: Array<string>;
  questionMedia: Media;
  level: number;
  type: 'text' | 'multiple_choice';
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
  __v: number;
}
