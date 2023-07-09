const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const Quiz = require('../model/quiz');

module.exports.createQuiz = async (req, res, next) => {
  try {
    const { userData, body } = req;
    const quiz = new Quiz({ owner: userData.userId, ...body });

    await quiz.save();

    return res.status(StatusCodes.CREATED).send({
      success: true,
      data: { data: quiz },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const body = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, body, { new: true })
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

    const quizzes = await Quiz.find({ owner: userId, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit));

    const totalQuizzes = await Quiz.countDocuments({ owner: userId, ...searchOptions });

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
    const collection = await Quiz.findById(quizId).populate('questions');

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    await Quiz.findByIdAndDelete(quizId);

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
    const quiz = await Quiz.findById(quizId);

    if (quiz?.code) {
      return res.status(StatusCodes.RESOURCE_EXISTED).send({ success: false, message: 'This quiz has already had a code!' });
    }

    const quizWithBiggestCode = await Quiz.findOne().sort({ code: -1 });
    let newCode;
    if (!quizWithBiggestCode?.code) {
      newCode = 1;
    } else {
      newCode = quizWithBiggestCode.code + 1;
    }

    await Quiz.findByIdAndUpdate(quizId, { code: newCode }, { new: true });

    return res.status(StatusCodes.OK).send({
      success: true,
      data: { code: newCode },
    });
  } catch (error) {
    next(error);
  }
};