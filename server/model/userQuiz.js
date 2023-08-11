const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { UserQuizStatus } = require('../constant/userQuizStatus');
const { QuizType } = require('../constant/quizType');

const Schema = mongoose.Schema;

const userQuizSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: String,
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    type: {
      type: String,
      default: QuizType.TEST,
    },
    shuffledQuestions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }],
    status: {
      type: String,
      default: UserQuizStatus.OPEN,
    },
    attempts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'QuizAttempt',
      },
    ],
    grade: Number, // grade is calculated after submitting
    assigned: {
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

const UserQuiz = mongoose.model('UserQuiz', userQuizSchema);

module.exports = UserQuiz;
