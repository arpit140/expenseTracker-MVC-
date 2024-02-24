require("dotenv").config();

const ForgotPassRequest = require("../models/forgotPassword");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SIB_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
const mongoose = require("mongoose");

exports.requestResetPassword = async (request, response, next) => {
  try {
    const { email } = request.body;
    const user = await User.findOne({ email });
    if (user) {
      const sender = {
        email: "arpitsunny6@gmail.com",
        name: "From Arpit",
      };
      const receivers = [
        {
          email: email,
        },
      ];
      const forgotPassRequest = new ForgotPassRequest({
        userId: user._id
      });
      // console.log("userid-----",user._id)
      const savedRequest = await forgotPassRequest.save();

      const mailresponse = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Reset Your Password",
        htmlContent: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Password Reset</title>
                    </head>
                    <body>
                        <div class="container">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <h1 class="text-center">Reset Your Password</h1>
                                            <p class="text-center">Click the button below to reset your admin account password:</p>
                                            <div class="text-center">
                                                <a href="${process.env.WEBSITE}/user/reset/{{params.role}}" class="btn btn-primary">Reset Password</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>`,
        params: {
          role: savedRequest._id,
        },
      });
      response.status(200).json({ message: "Password reset email sent" });
    } else {
      response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Interenal Server Error" });
  }
};

exports.resetPasswordForm = async (request, response, next) => {
  try {
    const { forgotId } = request.params;
    console.log(forgotId);
    const forgotPassRequest = await ForgotPassRequest.findById(forgotId);

    if (forgotPassRequest && forgotPassRequest.isactive) {
      forgotPassRequest.isactive = false;
      await forgotPassRequest.save();
      response.sendFile("reset.html", { root: "views" });
    } else {
      return response.status(401).json({ message: "Link has been expired" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (request, response, next) => {
  try {
    const { resetid, newpassword } = request.body;
    const forgotPassRequest = await ForgotPassRequest.findById(resetid);

    if (forgotPassRequest && forgotPassRequest.isactive) {
      const user = await User.findById(forgotPassRequest.userId);

      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password = hashedPassword;

      await user.save();
      response.status(200).json({ message: "Password reset successful." });
    } else {
      response.status(403).json({ message: "Link has expired" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};