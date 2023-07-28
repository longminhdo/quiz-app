const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { QuizType } = require('../constant/quizType');
const { formatDateTime } = require('../utils/helper');

const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    title: {
      type: String,
      default: 'Untitled Quiz',
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    code: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    quizType: {
      type: String,
      default: QuizType.MINI_TEST,
    },
    startTime: Number,
    endTime: Number,
    resultVisible: {
      type: Boolean,
      default: false,
    },
    multipleAttempts: {
      // used for assignments, after complete quiz, students can re-entry the quiz
      type: Boolean,
      default: false,
    },
    assignTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdIn: String,
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => dayjs().unix(),
    },
  },
);

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
