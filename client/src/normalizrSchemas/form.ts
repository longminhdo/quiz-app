import { schema } from 'normalizr';

export const questionSchema = new schema.Entity('questions', {}, { idAttribute: '_id' });

export const pageSchema = new schema.Entity(
  'pages',
  { questions: [questionSchema] },
  { idAttribute: '_id' },
);

export const formSchema = new schema.Entity(
  'form',
  {
    pages: [pageSchema],
  },
  { idAttribute: '_id' },
);
