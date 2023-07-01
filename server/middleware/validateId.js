const ObjectId = require('mongoose').Types.ObjectId;
const Form = require('../model/form');
const Page = require('../model/page');
const Question = require('../model/question');
const AppError = require('../helper/AppError');
const Response = require('../model/response');
const Answer = require('../model/answer');
const Collection = require('../model/collection');

//validate form id
exports.validateFormId = async (req, res, next) => {
  const { formId } = req.params;
  if (!ObjectId.isValid(formId)) {
    return next(new AppError(404, 'Invalid Form ID Type'));
  }

  const form = await Form.findById(formId);
  if (!form) {
    return next(new AppError(404, 'The form is not found or does not exist'));
  }

  if (form.userId.toString() !== req.userData.userId.toString()) {
    return next(new AppError(403, 'Access to this document is denied'));
  }

  return next();
};

//validate form id
exports.validateFormIdForResponse = async (req, res, next) => {
  const { formId } = req.params;
  if (!ObjectId.isValid(formId)) {
    return next(new AppError(404, 'Invalid Form ID Type'));
  }

  const form = await Form.findById(formId);
  if (!form) {
    return next(new AppError(404, 'The form is not found or does not exist'));
  }

  return next();
};

//validate page id
exports.validatePageId = async (req, res, next) => {
  const { pageId } = req.params;
  if (!ObjectId.isValid(pageId)) {
    return next(new AppError(404, 'Invalid Page ID Type'));
  }

  if (pageId) {
    const page = await Page.findById(pageId);
    if (!page) {
      return next(new AppError(404, 'The page is not found or does not exist'));
    }

    const form = await Form.findOne({
      _id: req.formId,
      pages: {
        _id: pageId,
      },
    });

    if (!form) {
      return next(
        new AppError(
          404,
          'Your page is not belong to any form, please double check',
        ),
      );
    }
  }
  return next();
};

// for edit and delete question
exports.validateQuestionId = async (req, res, next) => {
  const { questionId, pageId } = req.params;
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

    const page = await Page.findOne({
      _id: pageId,
      questions: {
        _id: questionId,
      },
    });

    if (!page) {
      return next(
        new AppError(
          404,
          'Your question is not belong to any page, please double check',
        ),
      );
    }
  }
  return next();
};

//check if reorder form question id is correct
exports.validateAllQuestionIds = async (req, res, next) => {
  const { id } = req.params;
  const ids = req.body;
  const form = await Form.findById(id);
  const questionIds = form.questions.map((q) => q.toString());
  //check if there is enough question
  if (ids.length !== questionIds.length) { return next(new AppError(404, 'Question is not found or does not exist')); }
  //check if every ids exist in form
  const isOrderCorrect = ids.every((q) => questionIds.includes(q));
  if (!isOrderCorrect) { return next(new AppError(404, 'Question is not found or does not exist')); }
  return next();
};

// check if every response question id belong or exist in form
exports.validateResponseQuestionId = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return next(new AppError(404, 'Invalid Form'));
  //check if form exist
  const form = await Form.findById(id);
  if (!form) return next(new Error('form not found'));

  const options = req.body.options;
  const ids = options.map((a) => a.questionId);
  const questionIds = form.questions.map((q) => q.toString());

  //check if every option question id exist in form
  const isQuestionCorrect = ids.every((q) => questionIds.includes(q));
  if (!isQuestionCorrect) { return next(new AppError(404, 'Question is not found or does not exist')); }
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
