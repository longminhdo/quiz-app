const mongoose = require('mongoose');
const { OptionType } = require('../constant/option');

const Schema = mongoose.Schema;

const questionValidateSchema = new Schema(
  {
    type: String,
    operations: String,
    min: Number,
    max: Number,
    pattern: String,
    message: String,
  },
  { _id: false },
);

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
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: OptionType.SHORT,
  },
  required: {
    type: Boolean,
    default: false,
  },
  otherAnswerAccepted: {
    type: Boolean,
    default: false,
  },
  questionMedia: { type: ImageSchema },
  validator: {
    type: questionValidateSchema,
  },
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
