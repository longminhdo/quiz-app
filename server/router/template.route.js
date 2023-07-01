const express = require('express');
const template = require('../controller/template.controller');
const catchAsync = require('../helper/catchAsync');

const router = express.Router();

router.get(
  '/',
  catchAsync(template.getAllTemplates),
);

module.exports = router;
