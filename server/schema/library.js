const { schemaQuestion } = require('./question');

const schemaLibrary = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
    },
    questions: {
      type: 'array',
      items: schemaQuestion,
    },
    sharedWith: {
      type: 'array',
    },
  },
  required: ['title'],
};

module.exports = {
  schemaLibrary,
};
