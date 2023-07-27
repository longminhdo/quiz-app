const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { UserQuizStatus } = require('../constant/userQuizStatus');

const Schema = mongoose.Schema;

const userQuizSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    shuffledQuestions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }],
    status: {
      type: Boolean,
      default: UserQuizStatus.OPEN,
    },
    attempts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'QuizAttempt',
      },
    ],
    grade: Number, // grade is calculated after submitting
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

const UserQuiz = mongoose.model('UserQuiz', userQuizSchema);

module.exports = UserQuiz;
