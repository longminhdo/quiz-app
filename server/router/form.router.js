const express = require('express');
const form = require('../controller/form.controller');
const analytic = require('../controller/analytic.controller');
const catchAsync = require('../helper/catchAsync');
const {
  validateFormId,
  validateFormIdForResponse,
} = require('../middleware/validateId');
const validateAuthentication = require('../middleware/validateAuthentication');
const { checkRole } = require('../auth/index');
const { UserRole } = require('../constant/role');

const router = express.Router();

router.use(validateAuthentication);

// checked
router.post(
  '/',
  // checkRole(),
  catchAsync(form.createForm),
);

// checked
router.get(
  '/',
  checkRole([UserRole.TEACHER, UserRole.STUDENT]),
  catchAsync(form.getAllForms),
);

//checked
router.get(
  '/:formId',
  // checkRole([UserRole.TEACHER, UserRole.STUDENT]),
  validateFormId,
  catchAsync(form.getForm),
);

// checked
router.delete(
  '/:formId',
  // checkRole(),
  validateFormId,
  catchAsync(form.deleteForm),
);

router.post(
  '/:formId/clone',
  validateFormId,
  catchAsync(form.cloneForm),
);

//checked
router.put(
  '/:formId',
  // reqSchemaValidator(validateForm),
  validateFormId,
  catchAsync(form.updateForm),
);

router.get(
  '/:formId/analytics',
  // checkAuth,
  // checkRole(),
  // isAuthor,
  catchAsync(analytic.getAnalytics),
);


router.use(
  '/:formId/responses',
  validateFormIdForResponse,
  async (req, res, next) => {
    req.formId = req.params.formId;
    return next();
  },
);

router.use(
  '/:formId/pages',
  validateFormId,
  async (req, res, next) => {
    req.formId = req.params.formId;
    return next();
  });

module.exports = router;
