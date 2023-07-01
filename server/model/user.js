const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    hustId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    refreshToken: String,
    departmentId: String,
    studentId: String,
    staffCode: String,
    sharedCollections: {
      type: Schema.Types.ObjectId,
      ref: 'Collection',
    },
  },
  {
    timestamps: {
      currentTime: () => dayjs().unix(),
    },
  },
);

module.exports = mongoose.model('User', userSchema);
