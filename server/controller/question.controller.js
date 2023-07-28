const isEmpty = require('lodash/isEmpty');
const Question = require('../model/question');
const Collection = require('../model/collection');
const { InternalServerError } = require('../constant/errorMessage');
const { StatusCodes } = require('../constant/statusCodes');

module.exports.importQuestions = async (req, res, next) => {
  const { collectionId } = req.params;
  const { newQuestions } = req.body;
  try {
    const createdQuestions = await Question.create(newQuestions);

    for (const question of createdQuestions) {
      await Collection.findByIdAndUpdate(collectionId, { $push: { questions: question._id } });
    }

    const collection = await Collection.findById(collectionId).populate('questions');

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
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

    const newCollection = await Collection.findById(collectionId)
      .populate({ path: 'questions', match: { deleted: false } });

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
      .populate({ path: 'questions', match: { deleted: false } });

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

module.exports.duplicateQuestion = async (req, res, next) => {
  try {
    const { collectionId, questionId } = req.params;
    const question = await Question.findById(questionId);

    const collection = await Collection.findById(collectionId);

    const index = collection.questions.findIndex((question) => question._id.toString() === questionId);

    const newQuestion = new Question({ ...question.toObject(), _id: undefined });
    await newQuestion.save();

    if (index >= 0) {
      collection.questions.splice(index + 1, 0, newQuestion);
    } else {
      collection.questions.push(newQuestion);
    }

    await collection.save();

    const newCollection = await Collection.findById(collectionId).populate({ path: 'questions', match: { deleted: false } });

    return res.status(200).send({ success: true, data: newCollection });
  } catch (error) {
    next(error);
  }
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

module.exports.createQuestion = async (req, res, next) => {
  const { collectionId } = req.params;
  try {
    const keys = req.body?.keys || [];
    const options = req.body?.options || [];

    if (isEmpty(keys)) {
      return res.status(StatusCodes.BAD_REQUEST)
        .json({ data: 'Keys can not be empty.' });
    }

    if (options.length > 5) {
      return res.status(StatusCodes.BAD_REQUEST)
        .json({ data: 'Question can not have more than five options.' });
    }

    const question = new Question({ ...req.body });
    await question.save({ new: true });

    const collection = await Collection
      .findById(collectionId)
      .populate(
        {
          path: 'questions',
          match: { deleted: false },
        },
      );

    collection.questions.push(question);

    await collection.save({ new: true });

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};
