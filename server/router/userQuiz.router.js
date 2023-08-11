const express = require('express');
const userQuiz = require('../controller/userQuiz.controller');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');
const { validateUserQuizId } = require('../middleware/validateId');

const router = express.Router();

router.use(validateAuthentication);

// POST /userQuizzes/join
router.post(
  '/join',
  catchAsync(userQuiz.join),
);

// POST /userQuizzes/assign
router.post(
  '/assign',
  catchAsync(userQuiz.assign),
);

// GET /userQuizzes
router.get(
  '/',
  catchAsync(userQuiz.getUserQuizzes),
);

// GET /userQuizzes/:userQuizId
router.get('/:userQuizId',
  validateUserQuizId,
  catchAsync(userQuiz.getUserQuizById),
);

// POST /userQuizzes/:userQuizId/submit
router.post('/:userQuizId/submit',
  validateUserQuizId,
  catchAsync(userQuiz.submit),
);

router.post(
  '/search',
  catchAsync(userQuiz.searchUserQuizzes),
);

module.exports = router;
