const express = require('express');
const analytics = require('../controller/analytics.controller');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');

const router = express.Router();

router.use(validateAuthentication);

router.get(
  '/count',
  catchAsync(analytics.count),
);

module.exports = router;
