require('dotenv').config();
const User = require('../model/user');
const AppError = require('../helper/AppError');
const { StatusCodes } = require('../constant/statusCodes');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const { userData } = req;
    // TODO: authorization
    console.log(userData);

    next();
  } catch (error) {
    return next(new AppError(StatusCodes.FORBIDDEN, 'Forbidden'));
  }
};
