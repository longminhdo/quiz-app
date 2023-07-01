const Form = require('../model/form');
const Response = require('../model/response');
const Answer = require('../model/answer');
const User = require('../model/user');
const AppError = require('../helper/AppError');

module.exports.addResponseToForm = async (req, res) => {
  const form = await Form.findById(req.params.id);
  const response = new Response(req.body);
  form.responses.push(response);
  // if (!form.isAllowAnonymous) {
  //   response.user = req.user.email;
  // }
  await response.save();
  await form.save();
  return res.status(201).send({ success: true, data: response });
};

module.exports.create = async (req, res) => {
  const { userId } = req.userData;

  const response = new Response({ userId });
  await response.save();

  const form = await Form.findById(req.params.formId);
  form.responses.push(response);
  await form.save();

  return res.status(201).send({ success: true, data: response });
};

module.exports.createOrUpdate = async (req, res) => {
  const { responseId } = req.params;
  const answer = req.body;

  const currentResponse = await Response.findById(responseId).populate(
    'answers',
  );
  let currentAnswer = currentResponse.answers.find(
    (answer) => answer.questionId.toString() === req.body.questionId.toString(),
  );

  if (currentAnswer) {
    currentAnswer = await Answer.findByIdAndUpdate(
      currentAnswer._id,
      {
        options: answer.options,
        otherAnswer: answer.otherAnswer,
      },
      { new: true },
    );
    const response = await Response.findById(responseId).populate('answers');
    return res.status(201).send({ success: true, data: response });
  }
  const userAnswer = { ...req.body, _id: undefined };
  const newAnswer = new Answer(userAnswer);
  await newAnswer.save();

  const response = await Response.findById(responseId).populate('answers');
  response.answers.push(newAnswer);
  await response.save();

  return res.status(201).send({ success: true, data: response });
};

module.exports.submit = async (req, res) => {
  // const { userId } = req.userData;
  // const form = await Form.findById(req.params.formId);
  // const { responses } = form;
  // const index = responses.findIndex(
  //   (response) => response.toString() === req.params.responseId.toString()
  // );
  // if (index > -1) responses.splice(index, 1);
  // await Response.deleteMany({
  //   userId,
  //   _id: {
  //     $in: responses,
  //   },
  // });
  const response = await Response.findOneAndUpdate(
    { _id: req.params.responseId },
    { submitted: true },
    { new: true },
  );

  return res.status(200).send({ success: true, data: response });
};

module.exports.get = async (req, res) => {
  const form = await Form.findOne({
    _id: req.params.formId,
  })
    .populate({
      path: 'responses',
      populate: 'answers',
    })
    .populate({
      path: 'pages',
      populate: 'questions',
    });

  let response;
  if (!req.userData?.userId) {
    response = new Response();
    await response.save();

    const form = await Form.findById(req.params.formId);
    form.responses.push(response);
    await form.save();
  } else {
    response = form.responses.find(
      (response) => response.userId === req.userData?.userId,
    ) || null;
    if (!response) {
      const userId = req.userData?.userId;

      response = new Response({ userId });
      await response.save();

      const form = await Form.findById(req.params.formId);
      form.responses.push(response);
      await form.save();
    }
  }

  return res.status(200).send({
    success: true,
    data: { ...form._doc, response, responses: undefined },
  });
};

module.exports.deleteAllResponses = async (req, res) => {
  const { formId: id } = req.params;
  const form = await Form.findById(id);
  const { responses } = form;
  await Response.deleteMany({
    _id: {
      $in: responses,
    },
  });
  await form.updateOne({ $pull: { responses: { $in: responses } } });
  return res.status(200).send('deleted all');
};

module.exports.getFullResponse = async (req, res, next) => {
  const { formId } = req.params;
  try {
    if (formId) {
      const form = await Form.findById(formId)
        .populate({
          path: 'responses',
          populate: 'answers',
        })
        .populate({
          path: 'pages',
          populate: 'questions',
        });
      let { responses } = form;

      // Get list of questions
      let questions = [];
      form?.pages?.forEach((page) => {
        if (page?.questions) {
          questions = questions?.concat(page?.questions);
        }
      });

      // Get list of submitted responses
      responses = responses?.filter((response) => response?.submitted);

      const newResponses = [];
      for (let i = 0; i < responses?.length; i++) {
        const newResponse = { ...responses[i]._doc };
        const user = await User.findOne({ hustId: newResponse.userId });
        newResponse.email = user?.email || null;
        const answers = [];
        questions?.forEach((question) => {
          const answer = responses[i]?.answers?.find(
            (r) => r?.questionId.toString() === question?._id.toString(),
          );
          if (answer) {
            answers.push({
              ...answer._doc,
              title: question?.title,
              description: question?.description,
              type: question?.type,
              required: question?.required,
              otherAnswerAccepted: question?.otherAnswerAccepted,
            });
          } else {
            answers.push({
              title: question?.title,
              description: question?.description,
              type: question?.type,
              required: question?.required,
              otherAnswerAccepted: question?.otherAnswerAccepted,
              otherAnswer: '',
              options: [],
            });
          }
        });
        newResponse.answers = answers;
        newResponses.push(newResponse);
      }

      return res.status(200).json({ responses: newResponses, questions });
    }
    return next(new AppError(400, 'Invalid form Id'));
  } catch (error) {
    return next(error);
  }
};
