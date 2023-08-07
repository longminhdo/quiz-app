const { StatusCodes } = require('../constant/statusCodes.js');
const QuizAttempt = require('../model/quizAttempt');

module.exports.updateQuizAttempt = async (req, res, next) => {
  try {
    const { quizAttemptId } = req.params;
    const body = req.body;

    await QuizAttempt.findByIdAndUpdate(quizAttemptId, body);

    return res.status(StatusCodes.OK).send({ success: true });
  } catch (error) {
    next(error);
  }
};
