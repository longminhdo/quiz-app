const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const collectionSchema = new Schema(
  {
    title: {
      type: String,
      default: 'Untitled Collection',
    },
    questions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    editors: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    viewers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
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
