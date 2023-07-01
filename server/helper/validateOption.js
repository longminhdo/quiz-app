const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const _ = require('lodash');
require('ajv-keywords')(ajv, ['uniqueItemProperties']);

const ajv = new Ajv({ useDefaults: true, coerceTypes: true });
addFormats(ajv);

exports.validatorOption = (option, { type, max, min, pattern }) => {
  switch (type) {
    case 'array':
      return this.validateArrayOption(option, { max, min });
    case 'string':
      return this.validateString(option, { max, min, pattern });
    case 'number':
      return this.validateNumber(option, { max, min });
    default:
      return 'Validator type does not support yet';
  }
};

exports.validateArrayOption = (optionArray, { max, min }) => {
  const schema = {
    type: 'array',
    ...(min && { minItems: min }),
    ...(max && { maxItems: max }),
  };
  return validateOptionSchema(optionArray, schema);
};

exports.validateString = (option, { max, min, pattern }) => {
  const schema = {
    type: 'string',
    ...(max && { maxLength: max }),
    ...(min && { minLength: min }),
    ...(pattern && { pattern }),
  };
  return validateOptionSchema(option, schema);
};

exports.validateNumber = (option, { max, min }) => {
  const schema = {
    type: 'number',
    ...(max && { maximum: max }),
    ...(min && { minimum: min }),
  };
  return validateOptionSchema(_.toNumber(option), schema);
};

const validateOptionSchema = (option, schema) => {
  const validate = ajv.compile(schema);
  const isValid = validate(option);
  if (!isValid) {
    console.log(validate.errors);
    return;
  }
  return true;
};
