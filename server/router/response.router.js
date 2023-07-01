const express = require('express');
const response = require('../controller/response.controller');
const { accessGranting, validateUserAccess } = require('../middleware/validateFormResponse');
const { validateFormId } = require('../middleware/validateId');
const catchAsync = require('../helper/catchAsync');

const router = express.Router({ mergeParams: true });

router.use(
  accessGranting,
  validateUserAccess,
);

router.post(
  '/',
  // checkAuth,
  // checkRole([roles.teacher, roles.student]),
  // validationResponseInput,
  // validateResponseQuestionId,
  // isFormAcceptResponse,
  // catchAsync(isOptionExist),
  // validateOption,
  catchAsync(response.create),
);

router.put(
  '/:responseId',
  // checkAuth,
  // checkRole(),
  // validateFormId,
  //isAuthor,
  catchAsync(response.createOrUpdate),
);

router.post(
  '/:responseId/submit',
  // checkAuth,
  // checkRole(),
  // validateFormId,
  //isAuthor,
  catchAsync(response.submit),
);

router.get(
  '/',
  catchAsync(response.get),
);

router.delete(
  '/',
  // checkAuth,
  // checkRole(),
  validateFormId,
  //isAuthor,
  catchAsync(response.deleteAllResponses),
);

router.get(
  '/fullResponse',
  validateFormId,
  catchAsync(response.getFullResponse),
);

module.exports = router;
