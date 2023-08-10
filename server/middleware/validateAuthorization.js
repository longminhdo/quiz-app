require('dotenv').config();
const { UserRole } = require('../constant/role');
const AppError = require('../helper/AppError');
const { StatusCodes } = require('../constant/statusCodes');

const adminEmail = process.env.ADMIN_EMAIL;

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const { userData } = req;
    const { role, email } = userData;

    if ([UserRole.TEACHER].includes(role)) {
      return next();
    }

    if (email !== adminEmail) {
      return next();
    }

    return next(new AppError(StatusCodes.FORBIDDEN, 'Forbidden'));
  } catch (error) {
    return next(new AppError(StatusCodes.FORBIDDEN, 'Forbidden'));
  }
};
