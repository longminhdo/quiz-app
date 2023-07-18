const express = require('express');
const quiz = require('../controller/quiz.controller');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');
const { validateQuizId } = require('../middleware/validateId');

const router = express.Router();

router.use(validateAuthentication);

// POST /quiz
router.post(
  '/',
  catchAsync(quiz.createQuiz),
);

// PUT /quizzes/:quizId
router.put(
  '/:quizId',
  validateQuizId,
  catchAsync(quiz.updateQuiz),
);

// GET /quizzes
router.get('/', catchAsync(quiz.getQuizzes));

// GET /quizzes/:quizId
router.get('/:quizId',
  validateQuizId,
  catchAsync(quiz.getQuizById),
);

// DELETE /quizzes/:quizId
router.delete(
  '/:quizId',
  validateQuizId,
  catchAsync(quiz.deleteQuiz),
);

// POST /quizzes/:quizId/generate-code
router.post(
  '/:quizId/generate-code',
  validateQuizId,
  catchAsync(quiz.generateCode),
);

module.exports = router;
