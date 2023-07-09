const ObjectId = require('mongoose').Types.ObjectId;
const Collection = require('../model/collection');
const Question = require('../model/question');
const AppError = require('../helper/AppError');
const Response = require('../model/response');
const Answer = require('../model/answer');

// for edit and delete question
exports.validateQuestionId = async (req, res, next) => {
  const { questionId, collectionId } = req.params;
  if (!ObjectId.isValid(questionId)) {
    return next(new AppError(404, 'Invalid Question ID type'));
  }

  if (questionId) {
    const question = await Question.findById(questionId);
    if (!question) {
      return next(
        new AppError(404, 'The question is not found or does not exist'),
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
          404,
          'Your question is not belong to any collection, please double check',
        ),
      );
    }
  }
  return next();
};

// validate response Id
exports.validateResponseId = async (req, res, next) => {
  const { responseId } = req.params;
  if (!ObjectId.isValid(responseId)) { return next(new AppError(404, 'Invalid Response')); }
  const response = await Response.findById(responseId);
  //const formResponse = Form.findOne({_id: id, responses:responseId})
  if (!response) return next(new AppError(404, 'Invalid Response'));
  return next();
};

exports.validateAnswerId = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return next(new AppError(404, 'Invalid Answer'));
  const answer = await Answer.findById(id);
  if (!answer) return next(new AppError(404, 'Invalid Answer'));
  return next();
};


//validate collection id
exports.validateCollectionId = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!ObjectId.isValid(collectionId)) {
    return next(new AppError(404, 'Invalid Collection ID Type'));
  }

  const collection = await Collection.findById(collectionId);
  if (!collection) {
    return next(new AppError(404, 'The collection is not found or does not exist'));
  }

  return next();
};
