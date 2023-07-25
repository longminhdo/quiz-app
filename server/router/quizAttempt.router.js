const express = require('express');
const quizAttempt = require('../controller/quizAttempt.controller');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');
const { validateQuizAttemptId } = require('../middleware/validateId');

const router = express.Router();

router.use(validateAuthentication);

// POST /quizAttempts
router.post(
  '/',
  catchAsync(quizAttempt.create),
);

router.post(
  '/join',
  catchAsync(quizAttempt.join),
);

// PUT /quizAttempts/:quizAttemptId
router.put(
  '/:quizAttemptId',
  validateQuizAttemptId,
  catchAsync(quizAttempt.updateQuizAttempt),
);

// GET /quizAttempts
router.get(
  '/',
  catchAsync(quizAttempt.getQuizAttempts),
);

// GET /quizAttempts/:quizAttemptId
router.get('/:quizAttemptId',
  validateQuizAttemptId,
  catchAsync(quizAttempt.getQuizAttemptById),
);

// DELETE /quizAttempts/:quizAttemptId
router.delete(
  '/:quizAttemptId',
  validateQuizAttemptId,
  catchAsync(quizAttempt.deleteQuiz),
);

// POST /quizAttempts/:quizAttemptId/submit
router.post(
  '/:quizAttemptId/submit',
  validateQuizAttemptId,
  catchAsync(quizAttempt.submitQuizAttempt),
);

module.exports = router;
