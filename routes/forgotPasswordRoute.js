const express = require("express");
const router = express.Router();

const passController = require("../controllers/forgotPasswordController");

router.post('/forgotpassword',passController.requestResetPassword);
router.get('/reset/:forgotId', passController.resetPasswordForm);
router.post('/password-reset',passController.resetPassword);

module.exports = router;