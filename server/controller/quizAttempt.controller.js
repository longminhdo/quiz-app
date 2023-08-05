const dayjs = require('dayjs');
const { isEqual } = require('lodash');
const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const { OptionType } = require('../constant/option.js');
const AppError = require('../helper/AppError.js');
const Quiz = require('../model/quiz');
const QuizAttempt = require('../model/quizAttempt');
const UserQuiz = require('../model/userQuiz');
const { shuffleArray } = require('../utils/helper.js');
const { QuizType } = require('../constant/quizType.js');
const { UserQuizStatus } = require('../constant/userQuizStatus.js');

const MAX_GRADE = 10;

// TODO: join quiz refactor
module.exports.join = async (req, res, next) => {
  try {
    const { userData } = req;
    const { code } = req.body;
    const now = dayjs().unix();

    const quizFound = await Quiz.findOne({ code });

    if (!quizFound) {
      return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz is not found or does not exist'));
    }

    if (now < quizFound.startTime) {
      return next(new Error('Quiz has not started yet.'));
    }

    if (now > quizFound.endTime) {
      return next(new Error('Quiz has already closed.'));
    }

    const quizId = quizFound._id;
    const ownerId = userData._id;

    const userQuizFound = await UserQuiz.findOne({ quiz: quizId, owner: ownerId });

    if (!userQuizFound) {
      const newQuizAttempt = new QuizAttempt();

      const newUserQuiz = new UserQuiz({
        owner: ownerId,
        quiz: quizId,
        shuffledQuestions: shuffleArray(quizFound.questions),
        attempts: [newQuizAttempt._id],
        type: QuizType.TEST,
        status: UserQuizStatus.DOING,
      });

      // newQuizAttempt.save();
    }


    // return res.status(StatusCodes.CREATED).send({
    //   success: true,
    //   data: {
    //     attemptId: found._id,
    //   },
    // });
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

    return res.status(StatusCodes.OK).send({ success: true, data: updatedQuiz });
  } catch (error) {
    next(error);
  }
};

module.exports.getQuizAttempts = async (req, res, next) => {
  try {
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

module.exports.getQuizAttemptById = async (req, res, next) => {
  try {
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

    const submittedQuiz = await QuizAttempt.findByIdAndUpdate(quizAttemptId, submitContent, { new: true })
      .populate('quiz');

    return res.status(StatusCodes.OK).send({ success: true, data: submittedQuiz });
  } catch (error) {
    next(error);
  }
};
