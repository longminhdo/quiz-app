const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const QuizAttempt = require('../model/quizAttempt');
const Quiz = require('../model/quiz');
const { shuffleArray } = require('../utils/helper.js');
const AppError = require('../helper/AppError.js');

module.exports.join = async (req, res, next) => {
  try {
    const { userData } = req;
    const { code } = req.body;

    const quiz = await Quiz.findOne({ code });

    if (!quiz) {
      return next(new AppError(StatusCodes.NOT_FOUND, 'The quiz is not found or does not exist'));
    }

    const found = await QuizAttempt
      .findOne({ quiz: quiz._id, owner: userData.id, deleted: false })
      .sort({ createdAt: -1 });

    if (!found || (found.submitted && quiz.multipleAttempts)) {
      const newQuizAttempt = new QuizAttempt({
        quiz: quiz._id,
        owner: userData.id,
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
    const quiz = new QuizAttempt({ owner: userData.userId, ...body });

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
    const { quizId } = req.params;
    const body = req.body;

    const updatedQuiz = await QuizAttempt.findByIdAndUpdate(quizId, body, { new: true })
      .populate('questions');

    return res.status(StatusCodes.OK).send({ success: true, data: { data: updatedQuiz } });
  } catch (error) {
    next(error);
  }
};

module.exports.getQuizAttempts = async (req, res, next) => {
  try {
    const { userId } = req.userData;
    const { offset = 1, limit = 10, sort = '', search, createdIn } = req.query;

    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = { title: { $regex: search, $options: 'i' }, createdIn: { $regex: createdIn } };

    !search && delete searchOptions.title;
    !createdIn && delete searchOptions.createdIn;

    const quizAttempts = await QuizAttempt.find({ owner: userId, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit));

    const totalQuizzes = await QuizAttempt.countDocuments({ owner: userId, ...searchOptions });

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
    const found = await QuizAttempt.findById(quizAttemptId).populate('shuffledQuestions');

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
