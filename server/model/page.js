const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const pageSchema = new Schema(
  {
    title: {
      type: String,
      default: 'Untitled Page',
    },
    description: {
      type: String,
      default: '',
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => dayjs().unix(),
    },
  },
);

module.exports = mongoose.model('Page', pageSchema);
