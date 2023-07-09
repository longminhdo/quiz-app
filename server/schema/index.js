const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { schemaQuestion } = require('./question');
const { schemaResponse } = require('./response');

const ajv = new Ajv({ useDefaults: true, coerceTypes: true });
addFormats(ajv);
require('ajv-keywords')(ajv, ['uniqueItemProperties']);

const schemaQuestions = {
  type: 'array',
  items: schemaQuestion,
};

const validateQuestions = ajv.compile(schemaQuestions);
const validateQuestion = ajv.compile(schemaQuestion);
const validateResponse = ajv.compile(schemaResponse);

module.exports = {
  validateQuestions,
  validateQuestion,
  validateResponse,
};
