const Form = require('../model/form');
const Response = require('../model/response');
const Question = require('../model/question');
const Answer = require('../model/answer');

module.exports.getAnalytics = async (req, res) => {
  const { question: questionId } = req.query;
  if (questionId) {
    const question = await Question.findById(questionId);
    question._doc.answers = [];
    const { responses: responsesIdList } = await Form.findById(
      req.params.formId,
    );
    const responsesDetailList = await Response.find({
      _id: {
        $in: responsesIdList,
      },
      submitted: true,
    });
    const answerIdList = responsesDetailList.reduce(
      (total, response) => total.concat(response.answers),
      [],
    );
    const answerDetailByQuestionIdList = await Answer.find({
      _id: {
        $in: answerIdList,
      },
      questionId,
    });
    const haveOtherAnswersResponseAnalytics = {};

    answerDetailByQuestionIdList?.forEach((answer) => {
      if (question.otherAnswerAccepted) {
        if (haveOtherAnswersResponseAnalytics[answer.otherAnswer]) { haveOtherAnswersResponseAnalytics[answer.otherAnswer]++; } else haveOtherAnswersResponseAnalytics[answer.otherAnswer] = 1;
      }

      answer.options.forEach((item) => {
        if (
          !question.options.find((option) => option.content === item.content)
        ) {
          if (haveOtherAnswersResponseAnalytics[item.content]) {
            haveOtherAnswersResponseAnalytics[item.content]++;
          } else haveOtherAnswersResponseAnalytics[item.content] = 1;
        }
      });
    });

    if (question.type !== 'short' && question.type !== 'long') {
      question?.options?.forEach((option) => {
        const answerCount = {
          answer: option.content,
        };
        let count = answerDetailByQuestionIdList?.filter((answer) => (
          answer.questionId === question.id
              && answer.options.find((item) => item.content === option.content)
        ))?.length || 0;
        if (haveOtherAnswersResponseAnalytics[option.content]) {
          count += haveOtherAnswersResponseAnalytics[option.content];
          delete haveOtherAnswersResponseAnalytics[option.content];
        }
        answerCount.count = count;
        question?._doc.answers?.push(answerCount);
      });
    }
    if (question.type !== 'short' && question.type !== 'long') {
      let totalOtherAnswer = 0;
      Object.keys(haveOtherAnswersResponseAnalytics)?.forEach((answer) => {
        if (answer) {
          // question?._doc.answers?.push({
          //   answer,
          //   count: haveOtherAnswersResponseAnalytics[answer],
          // });
          totalOtherAnswer += haveOtherAnswersResponseAnalytics[answer];
        }
      });
      if (totalOtherAnswer > 0) {
        question?._doc.answers?.push({
          otherAnswer: true,
          count: totalOtherAnswer,
          answer: 'Other answers',
        });
      }
    } else {
      Object.keys(haveOtherAnswersResponseAnalytics)?.forEach((answer) => {
        if (answer) {
          question?._doc.answers?.push({
            answer,
            count: haveOtherAnswersResponseAnalytics[answer],
          });
        }
      });
    }

    return res.send(question);
  }
  const form = await Form.findById(req.params.formId)
    .populate({
      path: 'pages',
      populate: 'questions',
    })
    .populate({
      path: 'responses',
      populate: 'answers',
    });
  const { responses } = form;
  let newResponses = [...responses];
  newResponses = newResponses?.filter((response) => response?.submitted);
  let answerData = [];
  let questions = [];
  form?.pages?.forEach((page) => {
    questions = questions.concat(page.questions);
  });
  responses?.forEach((response) => {
    if (response.submitted) answerData = answerData.concat(response.answers);
  });
  questions = questions?.map((question) => {
    let countTotalResponse = 0;
    question._doc.answers = [];
    const haveOtherAnswersResponse = answerData?.filter(
      (answer) => answer.questionId === question.id,
    );
    const haveOtherAnswersResponseAnalytics = {};

    haveOtherAnswersResponse?.forEach((answer) => {
      if (question.otherAnswerAccepted) {
        if (haveOtherAnswersResponseAnalytics[answer.otherAnswer]) { haveOtherAnswersResponseAnalytics[answer.otherAnswer]++; } else haveOtherAnswersResponseAnalytics[answer.otherAnswer] = 1;
      }

      answer.options.forEach((item) => {
        if (
          !question.options.find((option) => option.content === item.content)
        ) {
          if (haveOtherAnswersResponseAnalytics[item.content]) {
            haveOtherAnswersResponseAnalytics[item.content]++;
          } else haveOtherAnswersResponseAnalytics[item.content] = 1;
        }
      });
    });
    if (question.type !== 'short' && question.type !== 'long') {
      question?.options?.forEach((option) => {
        const answerCount = {
          answer: option.content,
        };
        let count = answerData?.filter((answer) => (
          answer.questionId === question.id
              && answer.options.find((item) => item.content === option.content)
        ))?.length || 0;
        if (haveOtherAnswersResponseAnalytics[option.content]) {
          count += haveOtherAnswersResponseAnalytics[option.content];
          delete haveOtherAnswersResponseAnalytics[option.content];
        }
        countTotalResponse += count;
        answerCount.count = count;
        question?._doc.answers?.push(answerCount);
      });
    }
    if (question.type !== 'short' && question.type !== 'long') {
      let totalOtherAnswer = 0;
      Object.keys(haveOtherAnswersResponseAnalytics)?.forEach((answer) => {
        if (answer) {
          totalOtherAnswer += haveOtherAnswersResponseAnalytics[answer];
          // question?._doc.answers?.push({
          //   answer,
          //   count: haveOtherAnswersResponseAnalytics[answer],
          // });
        }
      });
      // question._doc.answers = question._doc.answers.map((anwer) => {
      //   return {
      //     ...anwer,
      //     ratio: Number(
      //       ((anwer.ratio / (countTotalResponse || 1)) * 100).toFixed(2)
      //     ),
      //   };
      // });
      if (totalOtherAnswer > 0) {
        question?._doc.answers?.push({
          otherAnswer: true,
          count: totalOtherAnswer,
          answer: 'Other answers',
        });
      }
      question._doc.totalAnswers = countTotalResponse + totalOtherAnswer;
    } else {
      Object.keys(haveOtherAnswersResponseAnalytics)?.forEach((answer) => {
        if (answer) {
          countTotalResponse += haveOtherAnswersResponseAnalytics[answer];
          question?._doc.answers?.push({
            answer,
            count: haveOtherAnswersResponseAnalytics[answer],
          });
        }
      });
      question._doc.totalAnswers = countTotalResponse;
    }

    return question;
  });
  // const questionsContext = await Question.aggregate([
  //   {
  //     $match: {
  //       _id: {
  //         $in: questions,
  //       },
  //     },
  //   },
  // ]);
  // console.log(responses);

  // const pipeline = [
  //   {
  //     $match: {
  //       _id: {
  //         $in: responses,
  //       },
  //     },
  //   },
  //   {
  //     $unwind: '$options',
  //   },
  //   {
  //     $group: {
  //       _id: '$options.questionId',
  //       responses: {
  //         $push: '$options.option',
  //       },
  //     },
  //   },
  //   {
  //     $unwind: '$responses',
  //   },
  //   {
  //     $unwind: '$responses',
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         q: '$_id',
  //         r: '$responses.content',
  //       },
  //       count: {
  //         $sum: 1,
  //       },
  //       records: {
  //         $first: '$records',
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: '$_id.q',
  //       responses: {
  //         $push: {
  //           content: '$_id.r',
  //           count: '$count',
  //         },
  //       },
  //       records: {
  //         $sum: '$count',
  //       },
  //     },
  //   },
  // ];
  // const analytic = await Response.aggregate(pipeline);

  // const result = questions.map((question) => {
  //   const { title, type, required, option, _id } = question;
  //   let obj = analytic.find((o) => o._id === question._id.toString());
  //   if (!obj) {
  //     obj = { records: 0, responses: [] };
  //   }
  //   return { _id, title, type, required, option, ...obj };
  // });
  return res.status(200).send({
    success: true,
    data: {
      ...form._doc,
      analytics: questions,
      responses: newResponses,
    },
  });
};
