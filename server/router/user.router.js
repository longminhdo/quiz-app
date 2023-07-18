const express = require('express');
const user = require('../controller/user.controller');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');

const router = express.Router();

router.use(validateAuthentication);

// GET /users
router.get('/students', catchAsync(user.getStudents));

module.exports = router;
