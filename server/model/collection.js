const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const collectionSchema = new Schema(
  {
    title: {
      type: String,
      default: 'Untitled Collection',
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    owner: String,
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => dayjs().unix(),
    },
  },
);

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
