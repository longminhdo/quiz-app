import { schema } from 'normalizr';

export const answer = new schema.Entity('answer', undefined, { idAttribute: 'questionId' });
export const arrayOfAnswer = [answer];
