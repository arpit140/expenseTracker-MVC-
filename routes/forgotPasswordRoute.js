const express = require('express');
const router = express.Router();

const{
    forgotPasswordData ,
    resetPassword,
    newPassword
} =require('../controllers/forgotPasswordController');

router.post('/forgotPassword',forgotPasswordData);
router.get('/resetPassword/:uuid',resetPassword);
router.post('/newPassword',newPassword);

module.exports = router;