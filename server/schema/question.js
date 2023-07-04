const { OptionType } = require('../constant/option');

const schemaQuestion = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
    },
    questionMedia: {
      type: 'object',
      required: ['url', 'filename'],
      properties: {
        url: {
          type: 'string',
        },
        filename: {
          type: 'string',
        },
      },
    },
    type: {
      enum: [OptionType.MULTIPLE_CHOICE, OptionType.TEXT],
    },
    options: {
      type: 'array',
      uniqueItemProperties: ['content'],
      items: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          media: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
              },
              filename: {
                type: 'string',
              },
            },
            additionalProperties: false,
            required: ['url', 'filename'],
          },
        },
        required: ['content'],
        additionalProperties: false,
      },
    },
    keys: {
      type: 'array',
    },
    level: {
      type: 'number',
    },
  },
  required: ['title', 'type', 'level', 'keys'],
};

module.exports = {
  schemaQuestion,
};
