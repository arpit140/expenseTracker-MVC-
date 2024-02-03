const express = require('express');
const router = express.Router();

const { processSignup , processlogin } = require('../controllers/userController');

router.post('/signup',processSignup);

router.post('/login',processlogin);

module.exports = router;