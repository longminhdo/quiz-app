const dayjs = require('dayjs');
const { isEqual, cloneDeep } = require('lodash');
const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils.js');
const { shuffleArray } = require('../utils/helper.js');
const { OptionType } = require('../constant/option.js');
const AppError = require('../helper/AppError.js');
const Quiz = require('../model/quiz.js');
const QuizAttempt = require('../model/quizAttempt.js');
const UserQuiz = require('../model/userQuiz.js');
const { UserQuizStatus } = require('../constant/userQuizStatus.js');
const { QuizType } = require('../constant/quizType.js');

const MAX_GRADE = 10;

const examine = ({ completedQuestions, shuffledQuestions }) => {
  const shuffledQuestionsClone = cloneDeep(shuffledQuestions);
  const newCompletedQuestions = cloneDeep(completedQuestions);
  const pointPerQuestion = shuffledQuestionsClone?.length > 0 ? MAX_GRADE / shuffledQuestionsClone.length : 0;
  let grade = 0;
  newCompletedQuestions.forEach(item => {
    const foundQuestion = shuffledQuestionsClone.find(q => item.question === q._id);
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

  return { newCompletedQuestions, grade };
};

module.exports.join = async (req, res, next) => {
  try {
    const { userData } = req;
    const { code } = req.body;
    const ownerId = userData._id;
    const now = dayjs().unix();

    const quizFound = await Quiz.findOne({ code, deleted: false });

    if (!quizFound) {
      return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz is not found or does not exist'));
    }

    if (quizFound.status === UserQuizStatus.CLOSED) {
      return next(new AppError(StatusCodes.BAD_REQUEST, 'Quiz has already closed.'));
    }

    if (now < quizFound.startTime) {
      return next(new AppError(StatusCodes.BAD_REQUEST, 'Quiz has not started yet.'));
    }

    const quizId = quizFound._id;

    const userQuizFound = await UserQuiz
      .findOne({ quiz: quizId, owner: ownerId, deleted: false })
      .sort({ createdAt: -1 });

    if (!userQuizFound) {
      const newQuizAttempt = new QuizAttempt();

      const createdAttempt = await newQuizAttempt.save();

      const newUserQuiz = new UserQuiz({
        owner: ownerId,
        quiz: quizId,
        attempts: [createdAttempt._id],
        status: UserQuizStatus.DOING,
        shuffledQuestions: shuffleArray(quizFound.questions),
        type: QuizType.TEST,
        title: quizFound.title,
      });

      const createdUserQuiz = await newUserQuiz.save();

      return res.status(StatusCodes.OK).send({
        success: true,
        data: {
          userQuizId: createdUserQuiz._id,
        },
      });
    }

    return res.status(StatusCodes.OK).send({
      success: true,
      data: {
        userQuizId: userQuizFound._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserQuizzes = async (req, res, next) => {
  try {
    const { _id: userId } = req.userData;
    const { offset = 1, limit = 10, sort = '', search, submitted, type, statuses } = req.query;
    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = { title: { $regex: search, $options: 'i' }, submitted, type, status: { $in: statuses?.split(',') } };
    const defaultOptions = { owner: userId, deleted: { $ne: true } };

    !type && delete searchOptions.type;
    !statuses && delete searchOptions.status;
    !search && delete searchOptions.title;
    submitted === undefined && delete searchOptions.submitted;

    const userQuizzes = await UserQuiz.find({ ...defaultOptions, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit))
      .populate('quiz');

    const totalUserQuizzes = await UserQuiz.countDocuments({ ...defaultOptions, ...searchOptions });

    return res.status(StatusCodes.OK).send({
      success: true,
      data: {
        data: userQuizzes,
        pagination: {
          total: totalUserQuizzes,
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
    const { userQuizId } = req.params;
    const currentDate = dayjs().unix();
    const userQuizFound = await UserQuiz.findById(userQuizId).populate('shuffledQuestions quiz attempts');
    const currentQuiz = userQuizFound.quiz;
    const endDate = currentQuiz.endTime;
    const lastAttemptId = userQuizFound.attempts[userQuizFound.attempts.length - 1];
    const currentAttempt = await QuizAttempt.findById(lastAttemptId);

    if (endDate && currentDate > endDate) {
      const { newCompletedQuestions, grade } = examine({
        completedQuestions: currentAttempt?.completedQuestions || [],
        shuffledQuestions: userQuizFound?.shuffledQuestions || [],
      });

      const attemptUpdateContent = { submitted: true, newCompletedQuestions };
      await QuizAttempt.findByIdAndUpdate(lastAttemptId, attemptUpdateContent, { new: true });

      const userQuizUpdateContent = { status: UserQuizStatus.CLOSED, grade };
      const updatedUserQuiz = await UserQuiz.findByIdAndUpdate(userQuizId, userQuizUpdateContent, { new: true }).populate('shuffledQuestions quiz attempts');

      return res.status(StatusCodes.OK).send({ success: true, data: updatedUserQuiz });
    }

    if (!currentAttempt) {
      const newQuizAttempt = new QuizAttempt();
      const createdAttempt = await newQuizAttempt.save();
      const updatedUserQuiz = await UserQuiz
        .findByIdAndUpdate(userQuizId, { attempts: [createdAttempt._id], status: UserQuizStatus.DOING }, { new: true })
        .populate('shuffledQuestions quiz attempts');

      return res.status(StatusCodes.OK).send({ success: true, data: updatedUserQuiz });
    }

    return res.status(StatusCodes.OK).send({ success: true, data: userQuizFound });
  } catch (error) {
    next(error);
  }
};

module.exports.submit = async (req, res, next) => {
  try {
    const { body } = req;
    const { userQuizId } = req.params;
    const currentUserQuizFound = await UserQuiz.findById(userQuizId).populate('shuffledQuestions attempts');

    const submittedCompletedQuestions = body?.currentAttempt?.completedQuestions || [];
    const shuffledQuestions = currentUserQuizFound?.shuffledQuestions?.map(item => ({ ...item?._doc, _id: item?._doc?._id?.toString() })) || [];
    const { newCompletedQuestions, grade } = examine({
      completedQuestions: submittedCompletedQuestions,
      shuffledQuestions,
    });

    const foundAttempts = currentUserQuizFound?.attempts || [];
    const currentAttempt = foundAttempts.find(item => !item?.submitted);
    const currentAttemptId = currentAttempt._id;

    const submitContent = { submitted: true, completedQuestions: newCompletedQuestions };
    const userQuizUpdateContent = { grade, status: UserQuizStatus.DONE };

    await QuizAttempt.findByIdAndUpdate(currentAttemptId, submitContent, { new: true });

    const updatedUserQuiz = await UserQuiz.findByIdAndUpdate(userQuizId, userQuizUpdateContent, { new: true })
      .populate('shuffledQuestions quiz attempts');

    return res.status(StatusCodes.OK).send({ success: true, data: updatedUserQuiz });
  } catch (error) {
    next(error);
  }
};

module.exports.searchUserQuizzes = async (req, res, next) => {
  try {
    const { _id } = req.userData;
    const { offset = 1, limit = 5, search } = req.body;

    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = { title: { $regex: search, $options: 'i' } };

    !search && delete searchOptions.title;

    const quizzes = await UserQuiz.find({ owner: _id, ...searchOptions })
      .populate('quiz')
      .skip(skipCount)
      .limit(Number(limit));

    const totalQuizzes = await UserQuiz.countDocuments({ owner: _id, ...searchOptions });

    return res.status(StatusCodes.OK).send({
      success: true,
      data: {
        data: quizzes.map(c => ({ ...c._doc, ownerData: req.userData })),
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