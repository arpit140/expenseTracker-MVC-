require("dotenv").config();
const bcrypt = require("bcrypt");
let SibApiV3Sdk = require("sib-api-v3-sdk");
const User = require("../models/userModel");
const sequelize = require("../util/db");
const forgotPasswordReq = require("../models/forgotPassword");

const apiKey = process.env.SMTP_KEY;

const forgotPasswordData = async (req, res, next) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const email = req.body.email;

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const forPasswordReq = await forgotPasswordReq.create({
        userId: user.id,
        isactive: true,
      });

      console.log("this is user id ", user.id);
      console.log(
        "this is forgot password request userID ",
        forPasswordReq.userId
      );
      console.log("this is forgotPasswordrequst id", forPasswordReq.id);

      const apiKeyInstance = defaultClient.authentications["api-key"];
      apiKeyInstance.apiKey = apiKey;

      const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      //configure the email
      sendSmtpEmail.to = [{ email: email }];
      sendSmtpEmail.sender = {
        email: "arpitsunny6@gmail.com",
        name: "Arpit Singh",
      };

      sendSmtpEmail.subject = "Password Recovery";
      sendSmtpEmail.htmlContent = `
      <p>Hello ${user.username},</p>
      <p>We received a request to reset your password. Click the link below to reset your password:</p>
      <p><a href="http://localhost:3000/api/reset/resetPassword/${forPasswordReq.id}">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you,</p>
      <p>Your App Name Team</p>
    `;
      // send the email

      const response = await transactionalEmailsApi.sendTransacEmail(
        sendSmtpEmail
      );
      console.log(response);
      console.log("Recovery Email sent succesfully");
      res.status(200).json({ message: "Recovery email sent succesfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(
      "Error sending recovery email:",
      err.response ? err.response.text : err.message
    );
    res
      .status(500)
      .json({ message: "Error occured while sending recovery email" });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const forPasswordRequest = await forgotPasswordReq.findOne({
      where: { id: req.params.uuid },
    });
    if (!forPasswordRequest || !forPasswordRequest.isactive) {
      return res.status(401).json({ message: "Invalid reset link" });
    }

    const userId = forPasswordRequest.userId;

    res.redirect(`http://localhost:3000/api/resetPage?uuid=${req.params.uuid}`);
  } catch (err) {
    console.log("Error in resetPssword route:", err);
    res.status(500).json({ message: "internal Server Erorr" });
  }
};

const newPassword = async (req, res) => {
  let t;
  try {
    const password = req.body.password;
    const uuid = req.body.uuid;

    const forPasswordRequest = await forgotPasswordReq.findOne({
      where: { id: uuid, isactive: true },
    });
    if (!forPasswordRequest) {
      return res.status(401).json({ message: "Invalid reset link" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = forPasswordRequest.userId;
    t = await sequelize.transaction();
    const updatedUser = await User.update(
      { password: hashedPassword },
      { where: { id: userId } },
      { transaction: t }
    );

    await forPasswordRequest.update({ isactive: false }, { transaction: t });

    await t.commit();
    console.log(updatedUser);
    res.status(200).json({ message: "paswword updated succesfully" });
  } catch (err) {
    if (t) {
      await t.rollback();
    }

    console.log(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = { forgotPasswordData, resetPassword, newPassword };