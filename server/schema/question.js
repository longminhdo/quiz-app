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
      enum: [OptionType.LONG, OptionType.SHORT, OptionType.CHECKBOX, OptionType.RADIO],
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
    validator: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {},
        operations: {
          enum: ['max', 'min', 'inBetween', 'pattern'],
        },
        max: {
          type: 'number',
        },
        min: {
          type: 'number',
        },
        message: {
          type: 'string',
        },
      },
    },
  },
  required: ['title', 'description', 'type', 'required', 'otherAnswerAccepted', 'options'],
};

module.exports = {
  schemaQuestion,
};
