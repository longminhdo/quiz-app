const { startSession } = require('mongoose');
const Form = require('../model/form');
const Page = require('../model/page');
const Question = require('../model/question');
const DeleteMedia = require('../model/deleteMedia');
const Response = require('../model/response');
const Answer = require('../model/answer');

const getMediaToBeDeleted = (pages) => {
  //delete form media
  const toBeDeletedImgs = [];

  pages.forEach((page) => {
    page.questions.forEach((question) => {
      if (question.questionMedia) {
        toBeDeletedImgs.push(question.questionMedia);
      }

      question.options.forEach((option) => {
        if (option.media) {
          toBeDeletedImgs.push(option.media);
        }
      });
    });
  });

  return toBeDeletedImgs;
};

// create a new form and a question
module.exports.createForm = async (req, res) => {
  const { userId } = req.userData;

  const form = new Form({ userId });

  const question = new Question({});
  await question.save();

  const page = new Page({});
  await page.save();

  page.questions.push(question);
  await page.save();

  form.pages.push(page);
  await form.save();

  return res.status(201).send({
    success: true,
    data: form,
  });
};

//get all form sorted by recent
module.exports.getAllForms = async (req, res) => {
  const { userId } = req.userData;

  const forms = await Form.find({ userId })
    .select({ pages: 0, responses: 0 })
    .sort({ updatedAt: -1 });

  return res.status(200).send({
    success: true,
    data: forms,
  });
};

//get form and sorted questions
module.exports.getForm = async (req, res) => {
  const { formId } = req.params;

  const form = await Form.findById(formId)
    .populate({
      path: 'pages',
      populate: 'questions',
    })
    .populate({
      path: 'responses',
      populate: 'answers',
    });
  return res.status(200).send({
    success: true,
    data: form,
  });
};

module.exports.deleteForm = async (req, res, next) => {
  const session = await startSession();
  const { formId } = req.params;

  const form = await Form.findById(formId)
    .populate({
      path: 'pages',
      populate: 'questions',
    })
    .populate({
      path: 'responses',
      populate: 'answers',
    });

  try {
    session.startTransaction();

    //delete form media
    const toBeDeletedImgs = getMediaToBeDeleted(form.pages);
    await DeleteMedia.insertMany(toBeDeletedImgs, null, { session });

    // Delete Page in Page collection
    for (let j = 0; j < form.pages.length; j++) {
      const page = await Page.findByIdAndDelete(form.pages[j]._id).session(
        session,
      );

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
            if (option.media) {
              deleteImgs.push(option.media);
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
    }

    await Form.findByIdAndDelete(formId).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).send({ success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    next(error);
  }
};

module.exports.updateForm = async (req, res) => {
  const { formId } = req.params;
  const body = req.body;

  const updatedForm = await Form.findByIdAndUpdate(formId, body, {
    new: true,
  })
    .populate({
      path: 'pages',
      populate: 'questions',
    })
    .populate({
      path: 'responses',
      populate: 'answers',
    });

  return res.status(200).send({ success: true, data: updatedForm });
};

module.exports.cloneForm = async (req, res, next) => {
  const { formId } = req.params;
  try {
    const form = await Form.findById(formId)
      .populate({
        path: 'pages',
        populate: 'questions',
      })
      .populate({
        path: 'responses',
        populate: 'answers',
      });
    const { config, title, description, pages } = form;
    const newForm = new Form({
      config,
      title: `${title} (Copy)`,
      description,
      userId: req.userData.userId,
    });
    for (let i = 0; i < pages?.length; i++) {
      const {
        title: pageTitle,
        description: pageDescription,
        questions,
      } = pages[i];
      // Clone page
      const newpPage = new Page({
        title: pageTitle,
        description: pageDescription,
        questions: [],
      });

      // Clone questions
      for (let j = 0; j < questions?.length; j++) {
        const {
          title: questionTitle,
          description: questionDescription,
          type,
          required,
          otherAnswerAccepted,
          options,
        } = questions[j];
        const newQuestion = new Question({
          title: questionTitle,
          description: questionDescription,
          type,
          required,
          otherAnswerAccepted,
          options,
        });

        // Add question to cloned page
        await newQuestion.save({ new: true });
        newpPage.questions.push(newQuestion);
      }
      await newpPage.save({ new: true });
      newForm.pages.push(newpPage);
    }
    await newForm.save({ new: true });
    return res.status(200).send({
      success: true,
      data: newForm._id,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
