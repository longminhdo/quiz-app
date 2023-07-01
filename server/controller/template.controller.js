const Template = require('../model/template');

module.exports.getAllTemplates = async (req, res) => {
  const templates = await Template.find().populate('questions');

  return res.status(200).send({
    success: true,
    data: templates,
  });
};
