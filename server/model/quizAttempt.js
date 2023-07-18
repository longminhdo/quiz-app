const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const quizAttempt = new Schema(
  {
    owner: String,
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    shuffledQuestions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }],
    completedQuestions: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
      response: [String],
      correct: Boolean,
    }],
    grade: Number, // grade is calculated after submitting
    submitted: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
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
