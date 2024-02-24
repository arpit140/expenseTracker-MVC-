const User = require("../models/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// signup function for the user to sign in

const processSignUp = async (req, res) => {
  const { name, email, password, isPremium } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "missing required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isPremiumUser: isPremium,
    });
  
    const token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY);
    res.status(201).json({
      message:
        "registration successful. Check your email for a confirmation message",
      token: token,
      isPremium,
    });
  } catch (err) {
    console.error("error during sign-up", err);
    res.status(500).json({
      error: "an error occurred while registering the user",
    });
  }
};


//login function for the user to login

const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
    const isPremium = user.isPremiumUser;

    if (passwordMatch) {
      console.log("password match");
      //Passwords match, so the user is authenticated
      res.status(200).json({ message: "login successfully", token , isPremium});
    } else {
      console.log("password not match");
      // Passwords don't match
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the login" });
  }
};


module.exports = {
  processSignUp,
  processLogin,
};