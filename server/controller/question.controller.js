const { startSession } = require('mongoose');
const Page = require('../model/page');
const Question = require('../model/question');
const AppError = require('../helper/AppError');
const Collection = require('../model/collection');
const { InternalServerError } = require('../constant/errorMessage');
const { StatusCodes } = require('../constant/statusCodes');

module.exports.createQuestion = async (req, res, next) => {
  const { collectionId } = req.params;
  const session = await startSession();
  try {
    session.startTransaction();
    const question = new Question({ ...req.body });
    await question.save({ session, new: true });

    const collection = await Collection
      .findById(collectionId)
      .populate(
        {
          path: 'questions',
          match: { deleted: false },
        },
      );

    collection.questions.push(question);

    await collection.save({ session });

    const newCollection = await Collection.findById(collectionId).populate('questions');

    await session.commitTransaction();
    session.endSession();
    return res.status(StatusCodes.OK).send({ success: true, data: newCollection });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports.updateQuestion = async (req, res, next) => {
  try {
    const editedQuestion = req.body;
    const { questionId } = req.params;
    const { collectionId } = req.params;

    await Question.findByIdAndUpdate(
      questionId,
      editedQuestion,
      {
        new: true,
      },
    );

    const newCollection = await Collection.findById(collectionId).populate('questions');

    return res.status(200).send({ success: true, data: newCollection });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.deleteQuestion = async (req, res, next) => {
  try {
    const { collectionId, questionId } = req.params;

    await Question.findByIdAndUpdate(questionId, { deleted: true });

    const collection = await Collection
      .findByIdAndUpdate(collectionId, { $pull: { questions: questionId } }, { new: true })
      .populate('questions');

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

module.exports.duplicateQuestion = async (req, res, next) => {
  const { pageId, questionId } = req.params;

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new AppError(404, 'Could not find a question with the given questionId'));
  }

  const page = await Page.findById(pageId)
    .populate('questions');
  if (!page) {
    return next(new AppError(404, 'Could not find a page with the given pageId'));
  }

  const index = page.questions.findIndex((question) => question._id.toString() === questionId);

  const newQuestion = new Question({ ...question.toObject(), _id: undefined });
  await newQuestion.save();

  if (index >= 0) {
    page.questions.splice(index + 1, 0, newQuestion);
  } else {
    page.questions.push(newQuestion);
  }
  await page.save();

  return res.status(200).send({ success: true, data: page });
};

module.exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);

    return res.status(StatusCodes.OK).send({ success: true, data: question });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: InternalServerError.INTERNAL_SERVER_ERROR, error });
  }
};
