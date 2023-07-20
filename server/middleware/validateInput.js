const {
  validateQuestion,
  validateForm,
  validateQuestions,
  validateResponse,
} = require('../schema/index');
const AppError = require('../helper/AppError');

exports.reqSchemaValidator = (validate) => async (req, res, next) => {
  if (validate) {
    const inputIsValid = validate(req.body);
    if (!inputIsValid) return next(new AppError(400));
  }
  return next();
};
