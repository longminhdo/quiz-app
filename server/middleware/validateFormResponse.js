const Form = require('../model/form');
const AppError = require('../helper/AppError');
const { FormResponse } = require('../constant/errorMessage');
const validateAuthentication = require('./validateAuthentication');
const { getTokenFromReq } = require('../utils/helper');

exports.accessGranting = async (req, res, next) => {
  const form = await Form.findById(req.params.formId);
  const token = getTokenFromReq(req);
  const formConfig = form.config;

  if (!token && form && formConfig.isAllowAnonymous) {
    req.accessGranted = true;
    return next();
  }

  if (!token && form && !formConfig.isAllowAnonymous) {
    return next(new AppError(403, FormResponse.ACCESS_FORBIDDEN));
  }

  return validateAuthentication(req, res, next);
};

exports.validateUserAccess = async (req, res, next) => {
  if (req.accessGranted) {
    return next();
  }

  const form = await Form.findById(req.params.formId);
  const formConfig = form.config;
  const userData = req.userData;

  const userRoleAccepted = formConfig.acceptedRoles.includes(userData?.role);
  const userEnrollmentYearAccepted = formConfig.acceptedYears.length === 0
    || !userData?.studentId
    || formConfig.acceptedYears.includes(userData?.studentId?.substring(0, 4));

  if (!userRoleAccepted || !userEnrollmentYearAccepted) {
    return next(new AppError(403, FormResponse.ACCESS_FORBIDDEN));
  }

  return next();
};
