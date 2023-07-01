import { schema } from 'normalizr';

export const question = new schema.Entity('question', undefined, { idAttribute: '_id' });
export const arrayOfQuestion = [question];
