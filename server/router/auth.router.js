const express = require('express');
const {
  createEncodedState,
  createUserInfoToken,
  refreshToken,
} = require('../controller/auth.controller');

const router = express.Router();

router.get('/encodedState', createEncodedState);

router.post('/userToken', createUserInfoToken);

router.post('/refreshToken', refreshToken);

module.exports = router;
