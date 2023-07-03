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
    required: {
      type: 'boolean',
    },
    description: {
      type: 'string',
    },
    otherAnswerAccepted: {
      type: 'boolean',
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
  },
  required: ['title', 'type', 'required', 'otherAnswerAccepted', 'options'],
};

module.exports = {
  schemaQuestion,
};
