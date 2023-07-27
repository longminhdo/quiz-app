const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const quizAttempt = new Schema(
  {
    completedQuestions: [{
      question: String,
      response: [String],
      correct: Boolean,
    }],
    submitted: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    endedAt: Number,
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => dayjs().unix(),
    },
  },
);

module.exports = mongoose.model('QuizAttempt', quizAttempt);
