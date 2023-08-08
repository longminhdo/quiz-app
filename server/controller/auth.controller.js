const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');
const AppError = require('../helper/AppError');
const { UserRole } = require('../constant/role');
const { encrypt, decrypt } = require('../utils/crypto');
const User = require('../model/user');
const { SSOAuthentication } = require('../constant/errorMessage');

const {
  SSO_ENCODED_STATE,
  SSO_CLIENT_ID,
  SSO_DOMAIN,
  FE_BASE_URL,
  JWT_SECRET,
} = process.env;

exports.createEncodedState = (req, res, next) => {
  try {
    const token = jwt.sign(
      {
        state: SSO_ENCODED_STATE,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
        algorithm: 'HS256',
      },
      SSO_ENCODED_STATE,
    );
    return res.status(200).send({
      data: {
        url: `${SSO_DOMAIN}/ssoserver/sso?redirectUrl=${FE_BASE_URL}&clientId=${SSO_CLIENT_ID}&encodedState=${token}`,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.createUserInfoToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError(400, SSOAuthentication.MISSING_SSO_TOKEN));
  }

  try {
    const SSOresponse = await axios.get(
      `${SSO_DOMAIN}/auth/userinfo?token=${token}&clientId=${SSO_CLIENT_ID}&state=${SSO_ENCODED_STATE}`,
    );
    const { data } = SSOresponse;
    if (
      !data
      || !data.id
      || (!!data.staffCode && !data.userName)
      || (!!data.studentId && !data.email)
    ) {
      return next(new AppError(400, SSOAuthentication.INVALID_DATA));
    }

    const encodedData = {
      fullName: data.fullName,
      id: data.id,
      email: data.email || data.userName,
      departmentId: data?.departmentId,
      birthday: data?.birthdate,
      studentYear: data?.studentYear,
      phoneNumber: data?.phoneNumber,
      className: data?.className,
      avatar: data?.avatarUrl,
      schoolName: data?.schoolName,
      gender: data?.gender,
      year: data?.year,
    };

    if (data.studentId) {
      encodedData.studentId = data.studentId;
      encodedData.role = UserRole.STUDENT;
    } else if (data.staffCode) {
      encodedData.staffCode = data.staffCode;
      encodedData.role = UserRole.TEACHER;
    }

    const accessToken = jwt.sign(encodedData, JWT_SECRET, {
      expiresIn: '1d',
    });

    const encryptedUserId = encrypt(data.id);
    const refreshToken = jwt.sign(encryptedUserId, JWT_SECRET, {
      expiresIn: '7d',
    });

    let user = await User.findOne({ hustId: data.id });
    if (!user) {
      user = new User({
        ...encodedData,
        refreshToken,
        hustId: data.id,
      });

      await user.save();
    } else {
      user.refreshToken = refreshToken;
      await user.save();
    }

    return res.send({ data: { token: accessToken, refreshToken } });
  } catch (error) {
    return next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError(400, 'invalid token'));
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return next(new AppError(400, 'invalid token'));
  }

  try {
    const encryptedBlock = jwt.verify(refreshToken, JWT_SECRET);
    const userId = decrypt(encryptedBlock);
    if (user.hustId !== userId) {
      user.refreshToken = '';
      await user.save();
      return next(new AppError(400, 'invalid token'));
    }

    const encodedData = {
      id: user.hustId,
      email: user.email,
      departmentId: user.departmentId,
    };

    if (user.studentId) {
      encodedData.studentId = user.studentId;
      encodedData.role = UserRole.STUDENT;
    } else if (user.staffCode) {
      encodedData.staffCode = user.staffCode;
      encodedData.role = UserRole.TEACHER;
    }

    const accessToken = jwt.sign(encodedData, JWT_SECRET, {
      expiresIn: '1d',
    });

    const encryptedUserId = encrypt(user._id);
    const newRefreshToken = jwt.sign(encryptedUserId, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res
      .status(200)
      .send({ data: { token: accessToken, refreshToken: newRefreshToken } });
  } catch (error) {
    return next(error);
  }
};
