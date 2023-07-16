const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const quizAttempt = new Schema(
  {
    userId: String,
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    shuffledQuestions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    completedQuestions: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
      response: [String],
    }],
    acceptingResponse: Boolean,
    submitted: Boolean,
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
