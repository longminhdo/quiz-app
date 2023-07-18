const ObjectId = require('mongoose').Types.ObjectId;
const Collection = require('../model/collection');
const Quiz = require('../model/quiz');
const Question = require('../model/question');
const AppError = require('../helper/AppError');
const Answer = require('../model/answer');
const QuizAttempt = require('../model/quizAttempt');
const { StatusCodes } = require('../constant/statusCodes');

// for edit and delete question
exports.validateQuestionId = async (req, res, next) => {
  const { questionId, collectionId } = req.params;
  if (!ObjectId.isValid(questionId)) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'Invalid Question ID type'));
  }

  if (questionId) {
    const question = await Question.findById(questionId);
    if (!question) {
      return next(
        new AppError(StatusCodes.NOT_FOUND, 'The question is not found or does not exist'),
      );
    }

    if (question.deleted) {
      return next(
        new AppError(StatusCodes.NOT_FOUND, 'The question is not found or does not exist'),
      );
    }

    const collection = await Collection.findOne({
      _id: collectionId,
      questions: {
        _id: questionId,
      },
    });

    if (!collection) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          'Your question is not belong to any collection, please double check',
        ),
      );
    }
  }
  return next();
};

exports.validateAnswerId = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return next(new AppError(StatusCodes.NOT_FOUND, 'Invalid Answer'));
  const answer = await Answer.findById(id);
  if (!answer) return next(new AppError(StatusCodes.NOT_FOUND, 'Invalid Answer'));
  return next();
};


// validate collection id
exports.validateCollectionId = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!ObjectId.isValid(collectionId)) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'Invalid Collection ID Type'));
  }

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'The collection is not found or does not exist'));
  }

  if (collection.deleted) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'The collection is not found or does not exist'));
  }

  return next();
};

// validate quiz id
exports.validateQuizId = async (req, res, next) => {
  const { quizId } = req.params;

  if (!ObjectId.isValid(quizId)) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'Invalid Quiz ID Type'));
  }

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz is not found or does not exist'));
  }

  if (quiz.deleted) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz is not found or does not exist'));
  }

  return next();
};

// validate quiz attempt id
exports.validateQuizAttemptId = async (req, res, next) => {
  const { quizAttemptId } = req.params;

  if (!ObjectId.isValid(quizAttemptId)) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'Invalid Quiz Attempt ID Type'));
  }

  const quizAttempt = await QuizAttempt.findById(quizAttemptId);

  if (!quizAttempt) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz attempt is not found or does not exist'));
  }

  if (quizAttempt.deleted) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz attempt is not found or does not exist'));
  }

  return next();
};
