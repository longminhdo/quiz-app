const dayjs = require('dayjs');
const { isEqual } = require('lodash');
const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils.js');
const { shuffleArray } = require('../utils/helper.js');
const { OptionType } = require('../constant/option.js');
const AppError = require('../helper/AppError.js');
const Quiz = require('../model/quiz.js');
const QuizAttempt = require('../model/quizAttempt.js');

const MAX_GRADE = 10;

module.exports.join = async (req, res, next) => {
  try {
    // TODO: Join
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

module.exports.assign = async (req, res, next) => {
  try {
    // TODO: assign
  } catch (error) {
    next(error);
  }
};

module.exports.getUserQuizzes = async (req, res, next) => {
  try {
    // TODO: get user quizzes
    const { _id } = req.userData;
    const { offset = 1, limit = 10, sort = '', search, submitted } = req.query;

    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = { title: { $regex: search, $options: 'i' }, submitted };
    const defaultOptions = { owner: _id, deleted: { $ne: true } };

    !search && delete searchOptions.title;
    submitted === undefined && delete searchOptions.submitted;


    const quizAttempts = await QuizAttempt.find({ ...defaultOptions, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit))
      .populate('quiz');

    const totalQuizzes = await QuizAttempt.countDocuments({ ...defaultOptions, ...searchOptions });

    return res.status(StatusCodes.OK).send({
      success: true,
      data: {
        data: quizAttempts,
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

module.exports.getUserQuizById = async (req, res, next) => {
  try {
    // TODO: get user quiz by id
    const { quizAttemptId } = req.params;
    const currentDate = dayjs().unix();
    const found = await QuizAttempt.findById(quizAttemptId).populate('shuffledQuestions quiz');
    console.log(found);
    if (found?.endedAt && currentDate > found?.endedAt) {
      const { completedQuestions, shuffledQuestions } = found;
      const pointPerQuestion = shuffledQuestions?.length > 0 ? MAX_GRADE / shuffledQuestions.length : 0;
      let grade = 0;

      completedQuestions.forEach(item => {
        const foundQuestion = shuffledQuestions.find(q => item.question === q._id);

        if (foundQuestion.type === OptionType.MULTIPLE_CHOICE && foundQuestion.keys.length > 1) {
          const keys = foundQuestion.keys;
          const pointPerOption = pointPerQuestion / foundQuestion.keys.length;
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

        if (foundQuestion.type === OptionType.MULTIPLE_CHOICE && foundQuestion.keys.length === 1) {
          if (isEqual(foundQuestion.keys, item.response)) {
            grade += pointPerQuestion;
            item.correct = true;
          } else {
            item.correct = false;
          }
        }

        if (foundQuestion.type === OptionType.TEXT) {
          if (isEqual(foundQuestion.keys, item.response)) {
            item.correct = true;
            grade += pointPerQuestion;
          } else {
            item.correct = false;
          }
        }
      });

      const submitContent = { ...found._doc, submitted: true, completedQuestions, grade };

      const submittedQuiz = await QuizAttempt.findByIdAndUpdate(quizAttemptId, submitContent, { new: true })
        .populate('quiz');

      console.log('final', submitContent);

      return res.status(StatusCodes.OK).send({ success: true, data: submittedQuiz });
    }

    return res.status(StatusCodes.OK).send({ success: true, data: found });
  } catch (error) {
    next(error);
  }
};

