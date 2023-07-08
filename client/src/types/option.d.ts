import { Media } from '@/types/media';

export interface Option {
  content: string;
  media?: Media;
  id?: string | number;
}
