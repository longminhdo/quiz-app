const { startSession } = require('mongoose');
const Form = require('../model/form');
const Page = require('../model/page');
const Response = require('../model/response');
const Question = require('../model/question');
const DeleteMedia = require('../model/deleteMedia');
const Answer = require('../model/answer');
const AppError = require('../helper/AppError');

// create a default question
module.exports.create = async (req, res, next) => {
  const session = await startSession();
  const { index } = req.body;
  try {
    session.startTransaction();

    const question = new Question({});
    await question.save({ session, new: true });

    const page = await Page.findById(req.params.pageId)
      .session(session)
      .populate('questions');

    if (index >= 0) {
      page.questions.splice(index, 0, question);
    } else {
      page.questions.push(question);
    }

    await page.save({ session });

    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({ success: true, data: page });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    next(error);
  }
};

// update a question
module.exports.update = async (req, res, next) => {
  try {
    const editedQuestion = req.body;
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    const { _doc: currentQuestion } = question;

    //get old images from option
    const oldOptionImages = currentQuestion.options
      .filter(({ media }, index) => media?.url !== editedQuestion.options[index]?.media?.url)
      .map(({ media }) => media);

    //get old question image
    let oldQuestionMedia;
    const isQuestionMediaChanged = editedQuestion.questionMedia?.url === currentQuestion.questionMedia?.url;

    if (
      !isQuestionMediaChanged
      && currentQuestion.questionMedia !== undefined
    ) {
      oldQuestionMedia = currentQuestion.questionMedia;
      await question.updateOne({ $unset: { questionMedia: 1 } });
    }

    // move to deleteImg collection
    await DeleteMedia.insertMany([...oldOptionImages, oldQuestionMedia]);
    const newQuestion = await Question.findByIdAndUpdate(
      questionId,
      editedQuestion,
      {
        new: true,
      },
    );

    return res.status(200).send({ success: true, data: newQuestion });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  const session = await startSession();
  try {
    const { pageId, questionId } = req.params;
    const deleteImgs = [];

    session.startTransaction();
    const question = await Question.findById(questionId, null, { session });

    /* Delete imgs */
    // add question media to be deleted
    if (question?.questionMedia) {
      deleteImgs.push(question.questionMedia);
    }

    // add option media to be deleted
    if (question?.options) {
      for (const option of question.options) {
        if (option.media) {
          deleteImgs.push(option.media);
        }
      }
    }

    await Question.findByIdAndDelete(questionId).session(session);
    const page = await Page.findByIdAndUpdate(
      pageId,
      { $pull: { questions: questionId } },
      { session, new: true },
    );
    await Response.updateMany(
      {},
      { $pull: { options: { questionId } } },
      { session, new: true },
    );
    await Answer.deleteMany(
      {
        questionId: {
          $regex: questionId,
        },
      },
      { session, new: true },
    );
    await DeleteMedia.insertMany(deleteImgs, null, { session });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({ success: true, data: page });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    next(error);
  }
};

module.exports.duplicate = async (req, res, next) => {
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

module.exports.reOrder = async (req, res, next) => {
  const session = await startSession();
  try {
    const { pageId, questionId } = req.params;
    const { targetPageId, index } = req.body;

    // Get question
    const question = await Question.findById(questionId, null, { session });
    if (!question) {
      return next(new AppError(404, 'Could not find a question with the given questionId'));
    }

    // Get target page and add new question in
    const targetPage = await Page.findById(targetPageId, null, { session })
      .populate('questions');
    if (!targetPage) {
      return next(new AppError(404, 'Could not find target page with the given pageId'));
    }

    if (index >= 0) {
      targetPage.questions.splice(index, 0, question);
    } else {
      targetPage.questions.push(question);
    }

    // Get current page and remove question
    const sourcePage = await Page.findById(pageId, null, { session });
    sourcePage.questions = sourcePage.questions.filter(id => id.toString() !== questionId);

    await Promise.all([
      targetPage.save({ session, new: true }),
      sourcePage.save({ session, new: true }),
    ]);

    // Get form
    const form = await Form.findById(req.formId)
      .populate({
        path: 'pages',
        populate: 'questions',
      });

    return res.status(200).send({
      success: true,
      data: form,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    next(error);
  }
};
