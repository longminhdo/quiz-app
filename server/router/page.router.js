const express = require('express');
const page = require('../controller/page.controller');
const catchAsync = require('../helper/catchAsync');
const { validatePageId } = require('../middleware/validateId');
const validateAuthentication = require('../middleware/validateAuthentication');

const router = express.Router();

router.use(validateAuthentication);

router.post(
  '/',
  catchAsync(page.create),
);

router.put(
  '/re-order',
  catchAsync(page.reOrder),
);

router.delete(
  '/:pageId',
  validatePageId,
  catchAsync(page.delete),
);

router.put(
  '/:pageId',
  validatePageId,
  catchAsync(page.update),
);


router.use(
  '/:pageId/questions',
  validatePageId,
);

module.exports = router;
