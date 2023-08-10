const { QuizType } = require('../constant/quizType.js');
const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const Quiz = require('../model/quiz');
const UserQuiz = require('../model/userQuiz.js');
const { shuffleArray } = require('../utils/helper.js');

module.exports.createQuiz = async (req, res, next) => {
  try {
    const { userData, body } = req;
    const quiz = new Quiz({ owner: userData._id, ...body });

    const { quizType, assignTo } = body;

    await quiz.save();

    if (quizType === QuizType.ASSIGNMENT) {
      const userQuizzesData = assignTo.map(user => ({
        owner: user,
        quiz: quiz._id,
        shuffledQuestions: shuffleArray(quiz.questions),
        type: QuizType.ASSIGNMENT,
        assigned: true,
      }));

      UserQuiz.insertMany(userQuizzesData);
    }

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
      .populate('questions assignTo');

    return res.status(StatusCodes.OK).send({ success: true, data: updatedQuiz });
  } catch (error) {
    next(error);
  }
};

module.exports.getQuizzes = async (req, res, next) => {
  try {
    const { _id } = req.userData;
    const { offset = 1, limit = 10, sort = '', search, createdIn, type } = req.query;

    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = { title: { $regex: search, $options: 'i' }, createdIn: { $regex: createdIn }, quizType: type };

    !search && delete searchOptions.title;
    !type && delete searchOptions.quizType;
    !createdIn && delete searchOptions.createdIn;

    const quizzes = await Quiz.find({ owner: _id, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit));

    const totalQuizzes = await Quiz.countDocuments({ owner: _id, ...searchOptions });

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
    const quiz = await Quiz.findById(quizId).populate('questions assignTo');

    return res.status(StatusCodes.OK).send({ success: true, data: quiz });
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
    let newCodeNum;
    if (!quizWithBiggestCode?.code) {
      newCodeNum = 1;
    } else {
      newCodeNum = Number(String(Number(quizWithBiggestCode.code))) + 1;
    }

    const newCode = String(newCodeNum).padStart(6, '0');

    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, { code: newCode }, { new: true })
      .populate('questions assignTo');

    return res.status(StatusCodes.OK).send({
      success: true,
      data: updatedQuiz,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.assign = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { assignTo } = req.body;
    const newAssignTo = [];

    const currentQuiz = await Quiz.findById(quizId);

    for (const assignedId of assignTo) {
      const userQuizByItem = await UserQuiz.findOne({ owner: assignedId, quiz: quizId });
      console.log(userQuizByItem);
      if (userQuizByItem) {
        await UserQuiz.findByIdAndUpdate(userQuizByItem._id, { assigned: true });
      } else {
        newAssignTo.push(assignedId);
      }
    }

    console.log(newAssignTo);

    const userQuizzesData = newAssignTo.map(user => ({
      owner: user,
      quiz: quizId,
      shuffledQuestions: shuffleArray(currentQuiz.questions),
      type: QuizType.ASSIGNMENT,
      assigned: true,
    }));

    UserQuiz.insertMany(userQuizzesData);

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { assignTo },
      { new: true },
    ).populate('questions assignTo');

    return res.status(StatusCodes.OK).send({ success: true, data: updatedQuiz });
  } catch (error) {
    next(error);
  }
};

module.exports.removeAssign = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const body = req.body;
    const removingUserId = body.userId;

    await UserQuiz.findOneAndUpdate(
      { owner: removingUserId, quiz: quizId },
      { assigned: false },
      { new: true },
    );

    // TODO: delete all attempts

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $pull: { assignTo: removingUserId } },
      { new: true },
    ).populate('questions assignTo');

    return res.status(StatusCodes.OK).send({ success: true, data: updatedQuiz });
  } catch (error) {
    next(error);
  }
};

module.exports.getQuizAnalytics = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userQuizzes = await UserQuiz.find({ quiz: quizId }).populate('attempts owner');

    return res.status(StatusCodes.OK).send({ success: true, data: userQuizzes });
  } catch (error) {
    next(error);
  }
};
