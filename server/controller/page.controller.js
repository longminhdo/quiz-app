const { startSession } = require('mongoose');
const Form = require('../model/form');
const Page = require('../model/page');
const Question = require('../model/question');
const Response = require('../model/response');
const DeleteMedia = require('../model/deleteMedia');
const Answer = require('../model/answer');

// create a new form and a question
module.exports.create = async (req, res, next) => {
  const { index } = req.body;
  try {
    const form = await Form.findById(req.formId)
      .populate({
        path: 'pages',
        populate: 'questions',
      })
      .populate({
        path: 'responses',
        populate: 'answers',
      });

    // Create new page
    const newPage = new Page({});
    await newPage.save();
    const page = await Page.findById(newPage._id).populate('questions');

    // Create default question
    const newQuestion = new Question({});
    await newQuestion.save();
    page.questions.push(newQuestion);
    await page.save();

    if (index >= 0) form.pages.splice(index, 0, page);
    else form.pages.push(page);
    await form.save();
    return res.status(201).send({
      success: true,
      data: form,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  const session = await startSession();
  try {
    const page = await Page.findById(req.params.pageId);
    session.startTransaction();

    // Delete Page from Page collection
    await Page.findByIdAndDelete(req.params.pageId).session(session);

    // Delete related questions and responses
    for (let i = 0; i < page.questions.length; i++) {
      const deleteImgs = [];
      const question = await Question.findByIdAndDelete(page.questions[i], {
        session,
        new: true,
      });
      /* Delete imgs */
      // add question media to be deleted
      if (question?.questionMedia) {
        deleteImgs.push(question.questionMedia);
      }

      // add option media to be deleted
      if (question?.options) {
        for (const option of question.options) {
          if (option?.media) {
            deleteImgs.push(option?.media);
          }
        }
      }

      await Response.updateMany(
        {},
        { $pull: { options: { questionId: page.questions[i] } } },
        { session, new: true },
      );
      await Answer.deleteMany(
        {
          questionId: {
            $regex: page.questions[i],
          },
        },
        { session, new: true },
      );
      await DeleteMedia.insertMany(deleteImgs, null, { session });
    }

    // Delete Page in pageList of form
    const form = await Form.findByIdAndUpdate(
      req.formId,
      {
        $pull: {
          pages: req.params.pageId,
        },
      },
      { new: true, session },
    )
      .populate({
        path: 'pages',
        populate: 'questions',
      })
      .populate({
        path: 'responses',
        populate: 'answers',
      });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({ success: true, data: form });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    next(error);
  }
};

module.exports.update = async (req, res) => {
  const { title, description } = req.body;
  const page = await Page.findByIdAndUpdate(
    req.params.pageId,
    {
      $set: {
        title,
        description,
      },
    },
    { new: true },
  ).populate('questions');

  return res.status(200).send({ success: true, data: page });
};

module.exports.reOrder = async (req, res) => {
  const formId = req.formId;

  const { pageIds } = req.body;

  const form = await Form.findById(formId);

  const pageObjectByPageId = {};
  form.pages.forEach((pageIdObject) => {
    pageObjectByPageId[pageIdObject.toString()] = pageIdObject;
  });

  form.pages = pageIds.map((pageId) => pageObjectByPageId[pageId]);
  await form.save();
  await form.populate({
    path: 'pages',
    populate: 'questions',
  });

  return res.status(200).send({ success: true, data: form });
};
