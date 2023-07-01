const { schemaPage } = require('./page');
const { schemaResponse } = require('./response');

const schemaForm = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    pages: {
      type: 'array',
      uniqueItemProperties: ['title'],
      items: schemaPage,
    },
    responses: {
      type: 'array',
      items: schemaResponse,
    },
    config: {
      type: 'object',
      properties: {
        isAllowAnonymous: {
          type: 'boolean',
        },
        isAcceptResponse: {
          type: 'boolean',
        },
        isSubmittable: {
          type: 'boolean',
        },
        acceptedDepartments: {
          type: 'array',
        },
        acceptedRoles: {
          type: 'array',
        },
        acceptedYears: {
          type: 'array',
        },
      },
      required: ['isAllowAnonymous', 'isSubmittable'],
      additionalProperties: false,
    },
    validTime: {
      type: 'object',
      properties: {
        startTime: {
          type: 'number',
        },
        endTime: {
          type: 'number',
        },
      },
    },
    classId: {
      type: 'string',
    },
  },
  required: ['title', 'description'],
};

module.exports = {
  schemaForm,
};
