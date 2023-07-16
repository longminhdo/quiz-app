const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const QuizAttempt = require('../model/quizAttempt');

module.exports.createQuizAttempt = async (req, res, next) => {
  try {
    const { userId, quizId } = req;
    const quizAttempt = new QuizAttempt({ userId, quizId });

    await quizAttempt.save();

    return res.status(StatusCodes.CREATED).send({
      success: true,
      data: { data: quizAttempt },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateQuiz = async (req, res, next) => {
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

module.exports.getQuizzes = async (req, res, next) => {
  try {
    const { userId } = req.userData;
    const { offset = 1, limit = 10, sort = '', search, createdIn } = req.query;

    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = { title: { $regex: search, $options: 'i' }, createdIn: { $regex: createdIn } };

    !search && delete searchOptions.title;
    !createdIn && delete searchOptions.createdIn;

    const quizzes = await QuizAttempt.find({ owner: userId, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit));

    const totalQuizzes = await QuizAttempt.countDocuments({ owner: userId, ...searchOptions });

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

module.exports.getQuizById = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const collection = await QuizAttempt.findById(quizId).populate('questions');

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    await QuizAttempt.findByIdAndDelete(quizId);

    return res.status(StatusCodes.OK).send({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.generateCode = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const quiz = await QuizAttempt.findById(quizId);

    if (quiz?.code) {
      return res.status(StatusCodes.RESOURCE_EXISTED).send({ success: false, message: 'This quiz has already had a code!' });
    }

    const quizWithBiggestCode = await QuizAttempt.findOne().sort({ code: -1 });
    let newCode;
    if (!quizWithBiggestCode?.code) {
      newCode = 1;
    } else {
      newCode = quizWithBiggestCode.code + 1;
    }

    await QuizAttempt.findByIdAndUpdate(quizId, { code: newCode }, { new: true });

    return res.status(StatusCodes.OK).send({
      success: true,
      data: { code: newCode },
    });
  } catch (error) {
    next(error);
  }
};