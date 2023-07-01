const schemaOption = {
  type: 'object',
  additionalProperties: false,
  properties: {
    questionId: {
      type: 'string',
    },
    option: {
      type: 'array',
      minItems: 1,
      uniqueItemProperties: ['content'],
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['content'],
        properties: {
          content: {
            type: 'string',
          },
        },
      },
    },
  },
  required: ['questionId', 'option'],
};

const schemaResponse = {
  type: 'object',
  additionalProperties: false,
  properties: {
    options: {
      type: 'array',
      uniqueItemProperties: ['questionId'],
      items: schemaOption,
    },
  },
  required: ['options'],
};

module.exports = {
  schemaResponse,
};
