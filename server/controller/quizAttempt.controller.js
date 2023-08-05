const { isEqual } = require('lodash');
const { StatusCodes } = require('../constant/statusCodes.js');
const { OptionType } = require('../constant/option.js');
const QuizAttempt = require('../model/quizAttempt');

const MAX_GRADE = 10;

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
