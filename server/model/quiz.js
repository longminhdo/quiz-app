const mongoose = require('mongoose');
const dayjs = require('dayjs');

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
    owner: String,
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
