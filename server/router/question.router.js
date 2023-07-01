const express = require('express');
const question = require('../controller/question.controller');
const { validateQuestionId } = require('../middleware/validateId');
const { reqSchemaValidator } = require('../middleware/validateInput');
const { validateQuestion } = require('../schema');
const validateAuthentication = require('../middleware/validateAuthentication');
const catchAsync = require('../helper/catchAsync');

const router = express.Router({ mergeParams: true });

router.use(validateAuthentication);

router.post(
  '',
  catchAsync(question.create),
);

router.delete(
  '/:questionId',
  validateQuestionId,
  catchAsync(question.delete),
);

router.put(
  '/:questionId',
  reqSchemaValidator(validateQuestion),
  validateQuestionId,
  catchAsync(question.update),
);

router.post(
  '/:questionId/duplicate',
  validateQuestionId,
  catchAsync(question.duplicate),
);

router.put(
  '/:questionId/re-order',
  validateQuestionId,
  catchAsync(question.reOrder),
);

module.exports = router;
