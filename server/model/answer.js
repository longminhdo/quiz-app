const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  questionId: String,
  otherAnswer: String,
  options: [
    {
      content: String,
      _id: false,
    },
  ],
});

module.exports = mongoose.model('Answer', answerSchema);
