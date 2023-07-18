const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const QuizAttempt = require('../model/quizAttempt');

module.exports.join = async (req, res, next) => {
  try {
    const { userId, quizId } = req;
    const quizAttempt = new QuizAttempt({ owner: userId, quizId });

    await quizAttempt.save();

    return res.status(StatusCodes.CREATED).send({
      success: true,
      data: { data: quizAttempt },
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
    const { quizId, userId } = req.params;
    const collection = await QuizAttempt.find({ owner: userId, quiz: quizId }).populate('questions');

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};
