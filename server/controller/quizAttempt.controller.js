const { isEqual } = require('lodash');
const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const QuizAttempt = require('../model/quizAttempt');
const Quiz = require('../model/quiz');
const { shuffleArray } = require('../utils/helper.js');
const AppError = require('../helper/AppError.js');
const { OptionType } = require('../constant/option.js');

const MAX_GRADE = 10;

module.exports.join = async (req, res, next) => {
  try {
    const { userData } = req;
    const { code } = req.body;

    const quiz = await Quiz.findOne({ code });

    if (!quiz) {
      return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz is not found or does not exist'));
    }

    const found = await QuizAttempt
      .findOne({ quiz: quiz._id, owner: userData._id, deleted: false })
      .sort({ createdAt: -1 });

    if (!found || (found.submitted && quiz.multipleAttempts)) {
      const newQuizAttempt = new QuizAttempt({
        quiz: quiz._id,
        owner: userData._id,
        shuffledQuestions: shuffleArray(quiz.questions),
      });

      await newQuizAttempt.save();

      return res.status(StatusCodes.CREATED).send({
        success: true,
        data: {
          attemptId: newQuizAttempt._id,
        },
      });
    }

    if (found.submitted) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        data: 'The quiz is closed for joining.',
      });
    }

    return res.status(StatusCodes.CREATED).send({
      success: true,
      data: {
        attemptId: found._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createQuizAttempt = async (req, res, next) => {
  try {
    const { userData, body } = req;
    const quiz = new QuizAttempt({ owner: userData._id, ...body });

    await quiz.save();

    return res.status(StatusCodes.CREATED).send({
      success: true,
      data: { data: quiz },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateQuizAttempt = async (req, res, next) => {
  try {
    const { quizAttemptId } = req.params;
    const body = req.body;

    const updatedQuiz = await QuizAttempt.findByIdAndUpdate(quizAttemptId, body, { new: true })
      .populate('shuffledQuestions quiz');

    return res.status(StatusCodes.OK).send({ success: true, data: { data: updatedQuiz } });
  } catch (error) {
    next(error);
  }
};

module.exports.getQuizAttempts = async (req, res, next) => {
  try {
    const { _id } = req.userData;
    const { offset = 1, limit = 10, sort = '', search, createdIn } = req.query;

    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = { title: { $regex: search, $options: 'i' }, createdIn: { $regex: createdIn } };

    !search && delete searchOptions.title;
    !createdIn && delete searchOptions.createdIn;

    const quizAttempts = await QuizAttempt.find({ owner: _id, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit));

    const totalQuizzes = await QuizAttempt.countDocuments({ owner: _id, ...searchOptions });

    return res.status(StatusCodes.OK).send({
      success: true,
      data: {
        data: quizAttempts.map(c => ({ ...c._doc, ownerData: req.userData })),
        pagination: {
          total: totalQuizzes,
          offset: Number(offset),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getQuizAttemptById = async (req, res, next) => {
  try {
    const { quizAttemptId } = req.params;
    const found = await QuizAttempt.findById(quizAttemptId).populate('shuffledQuestions quiz');

    if (found.submitted) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        data: 'The quiz is closed for joining.',
      });
    }

    return res.status(StatusCodes.OK).send({ success: true, data: found });
  } catch (error) {
    next(error);
  }
};

module.exports.submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizAttemptId } = req.params;
    const body = req.body;
    const { completedQuestions, shuffledQuestions } = body;

    const pointPerQuestion = shuffledQuestions?.length > 0 ? MAX_GRADE / shuffledQuestions.length : 0;
    let grade = 0;

    completedQuestions.forEach(item => {
      const found = shuffledQuestions.find(q => item.question === q._id);

      if (found.type === OptionType.MULTIPLE_CHOICE && found.keys.length > 1) {
        const keys = found.keys;
        const pointPerOption = pointPerQuestion / found.keys.length;
        let tmpPoint = 0;

        item.response.forEach(r => {
          if (keys.includes(r)) {
            tmpPoint += pointPerOption;
          } else {
            tmpPoint -= pointPerOption;
          }
        });

        if (tmpPoint <= 0) {
          tmpPoint = 0;
        }

        if (tmpPoint !== pointPerQuestion) {
          item.correct = false;
        } else {
          item.correct = true;
        }

        grade += tmpPoint;
      }

      if (found.type === OptionType.MULTIPLE_CHOICE && found.keys.length === 1) {
        if (isEqual(found.keys, item.response)) {
          grade += pointPerQuestion;
          item.correct = true;
        } else {
          item.correct = false;
        }
      }

      if (found.type === OptionType.TEXT) {
        if (isEqual(found.keys, item.response)) {
          item.correct = true;
          grade += pointPerQuestion;
        } else {
          item.correct = false;
        }
      }
    });

    const submitContent = { ...body, submitted: true, completedQuestions, grade };

    const submittedQuiz = await QuizAttempt.findByIdAndUpdate(quizAttemptId, submitContent, { new: true });

    return res.status(StatusCodes.OK).send({ success: true, data: submittedQuiz });
  } catch (error) {
    next(error);
  }
};
