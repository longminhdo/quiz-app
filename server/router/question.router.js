const express = require('express');
const question = require('../controller/question.controller');
const { validateQuestionId, validateCollectionId } = require('../middleware/validateId');
const { reqSchemaValidator } = require('../middleware/validateInput');
const { validateQuestion } = require('../schema');
const validateAuthentication = require('../middleware/validateAuthentication');
const catchAsync = require('../helper/catchAsync');

const router = express.Router({ mergeParams: true });

router.use(validateAuthentication);
router.use(validateCollectionId);

router.post(
  '',
  catchAsync(question.createQuestion),
);

router.delete(
  '/:questionId',
  validateQuestionId,
  catchAsync(question.deleteQuestion),
);

router.put(
  '/:questionId',
  reqSchemaValidator(validateQuestion),
  validateQuestionId,
  catchAsync(question.updateQuestion),
);

router.post(
  '/:questionId/duplicate',
  validateQuestionId,
  catchAsync(question.duplicateQuestion),
);

router.get(
  '/:questionId',
  validateQuestionId,
  catchAsync(question.getQuestionById),
);

module.exports = router;
