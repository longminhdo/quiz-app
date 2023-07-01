const mongoose = require('mongoose');
const dayjs = require('dayjs');
const Response = require('./response');
const Question = require('./question');
const { UserRole } = require('../constant/role');

const Schema = mongoose.Schema;

const formSchema = new Schema(
  {
    userId: String,
    title: {
      type: String,
      default: 'Untitled Form',
    },
    description: {
      type: String,
      default: '',
    },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Page',
      },
    ],
    responses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Response',
      },
    ],
    config: {
      _id: false,
      isAcceptResponse: {
        type: Boolean,
        default: true,
      },
      isAllowAnonymous: {
        type: Boolean,
        default: true,
      },
      isSubmittable: {
        type: Boolean,
        default: true,
      },
      acceptedDepartments: {
        type: [
          {
            _id: false,
            id: {
              type: String,
              required: true,
            },
            parentId: {
              type: String,
              required: true,
            },
            level: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      acceptedRoles: {
        type: Array,
        default: [UserRole.STUDENT],
      },
      acceptedYears: {
        type: Array,
        default: [],
      },
      validTime: {
        startTime: {
          type: Number,
        },
        endTime: {
          type: Number,
        },
      },
    },
    classId: String,
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => dayjs().unix(),
    },
  },
);

formSchema.post('findByIdAndDelete', async (doc) => {
  if (doc) {
    await Response.deleteMany({
      _id: {
        $in: doc.responses,
      },
    });
    await Question.deleteMany({
      _id: {
        $in: doc.responses,
      },
    });
  }
});

module.exports = mongoose.model('Form', formSchema);
