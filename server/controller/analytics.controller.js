const { QuizType } = require('../constant/quizType.js');
const { StatusCodes } = require('../constant/statusCodes.js');
const Quiz = require('../model/quiz');
const Collection = require('../model/collection');


module.exports.count = async (req, res, next) => {
  try {
    const { userData } = req;
    const owner = userData._id;
    const testCount = await Quiz.countDocuments({ owner, quizType: QuizType.TEST, deleted: { $ne: true } });
    const assignmentCount = await Quiz.countDocuments({ owner, quizType: QuizType.ASSIGNMENT, deleted: { $ne: true } });
    const collectionCount = await Collection.countDocuments({ owner, deleted: { $ne: true } });

    return res.status(StatusCodes.OK).send({ success: true, data: { testCount, assignmentCount, collectionCount } });
  } catch (error) {
    next(error);
  }
};
