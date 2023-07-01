const { schemaQuestion } = require('./question');

const schemaPage = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    questions: {
      type: 'array',
      uniqueItemProperties: ['title'],
      items: schemaQuestion,
    },
  },
  required: ['title', 'description', 'questions'],
};

module.exports = {
  schemaPage,
};
