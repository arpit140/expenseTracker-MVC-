require("dotenv").config();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
// Make sure this matches the key you used to sign the token

const verify = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const key = process.env.SECRET_KEY;
    //console.log("token",token);
    //console.log("key",key);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token not provided" });
    }
    const user = jwt.verify(token, key, { maxAge: "30d" });

    try {
      const foundUser = await User.findOne({ _id: user.userId });

      if (foundUser) {
        req.user = user;
        //console.log("this is user", req.user);
        next();
      } else {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching the user",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Token verification failed" });
  }
};

module.exports = verify;