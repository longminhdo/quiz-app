const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: String,
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
    avatar: String,
    refreshToken: String,
    departmentId: String,
    studentId: String,
    staffCode: String,
    birthday: Number,
    studentYear: String,
    phoneNumber: String,
    className: String,
    schoolName: String,
    gender: Number,
    createdAt: Number,
    updatedAt: Number,
    year: Number,
  },
  {
    timestamps: {
      currentTime: () => dayjs().unix(),
    },
  },
);

module.exports = mongoose.model('User', userSchema);
