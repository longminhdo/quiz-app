require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { Authentication } = require('../constant/errorMessage');
const AppError = require('../helper/AppError');
const { getTokenFromReq } = require('../utils/helper');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      throw new Error();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken.id) {
      return next(new AppError(401, Authentication.INVALID_TOKEN));
    }

    const user = await User.findOne({ hustId: decodedToken.id });
    if (!user) {
      return next(new AppError(401, Authentication.USER_NOT_FOUND));
    }

    const decodeData = {
      ...decodedToken,
      userId: decodedToken.id.toString(),
    };
    req.userData = decodeData;

    next();
  } catch (error) {
    return next(new AppError(401, Authentication.INVALID_TOKEN));
  }
};
