const Answer = require('../model/answer');

exports.deleteAnswer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const answer = await Answer.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      answer,
    });
  } catch (error) {
    return next(error);
  }
};
