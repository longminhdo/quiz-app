const express = require('express');
const catchAsync = require('../helper/catchAsync');
const { validateAnswerId } = require('../middleware/validateId');
const validateAuthentication = require('../middleware/validateAuthentication');
const answer = require('../controller/answer.controller');

const router = express.Router();

router.use(validateAuthentication);

router.delete('/:id', validateAnswerId, catchAsync(answer.deleteAnswer));

module.exports = router;
