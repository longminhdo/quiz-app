const mongoose = require('mongoose');
const { OptionType } = require('../constant/option');
const { QuestionLevel } = require('../constant/level');

const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    url: String,
    filename: String,
  },
  { _id: false },
);

const questionSchema = new Schema({
  title: {
    type: String,
    default: 'Untitled Question',
  },
  type: {
    type: String,
    default: OptionType.MULTIPLE_CHOICE,
  },
  level: {
    type: Number,
    default: QuestionLevel.REMEMBER,
  },
  keys: {
    type: [String],
    default: [],
  },
  questionMedia: { type: ImageSchema },
  options: {
    type: [
      {
        _id: false,
        content: {
          type: String,
          default: 'Option 1',
        },
        media: {
          type: ImageSchema,
        },
      },
    ],
    default: [
      {
        content: 'Option 1',
      },
    ],
  },
});

module.exports = mongoose.model('Question', questionSchema);
