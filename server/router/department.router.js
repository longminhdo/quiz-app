const express = require('express');
const { getDepartment } = require('../controller/department.controller');
const catchAsync = require('../helper/catchAsync');

const router = express.Router();

router.get('/', catchAsync(getDepartment));

module.exports = router;
