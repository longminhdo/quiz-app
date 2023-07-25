const User = require('../model/user');
const { UserRole } = require('../constant/role');
const { StatusCodes } = require('../constant/statusCodes');

module.exports.getStudents = async (req, res, next) => {
  try {
    const currentUserId = req.userData._id;
    const { offset = 1, limit = 10, search, forAssigning = false } = req.query;

    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = {
      $or: [
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ],
    };
    const skipCurrentUser = forAssigning ? { _id: { $ne: currentUserId } } : {};

    !search && delete searchOptions.email;
    !search && delete searchOptions.studentId;

    const payload = { role: UserRole.STUDENT, ...searchOptions, ...skipCurrentUser };

    const users = await User.find(payload)
      .skip(skipCount)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(payload);

    return res.status(StatusCodes.OK).send({
      success: true,
      data: {
        data: users.map(({ _doc }) => ({ studentId: _doc.studentId, email: _doc.email, role: _doc.role, _id: _doc._id })),
        pagination: {
          total: totalUsers,
          offset: Number(offset),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const { userData } = req;

    const user = await User.findById(userData._id);

    return res.status(StatusCodes.OK).send({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
