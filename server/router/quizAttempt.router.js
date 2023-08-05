const express = require('express');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');
const quizAttempt = require('../controller/quizAttempt.controller');

const router = express.Router();

router.use(validateAuthentication);

// PUT /quizAttempts/:quizAttemptId
router.put(
  '/:quizAttemptId',
  catchAsync(quizAttempt.updateQuizAttempt),
);

module.exports = router;
