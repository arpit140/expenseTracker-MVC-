require('dotenv').config();
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


const processSignup = async (req, res) => {
  try {
    const { name, email, password , isPremium } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "all fieds are mandatory" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      isPremiumuser: isPremium,
    });

    const token = jwt.sign({userId : newUser.id}, process.env.jwtSecret);
    const subject = "Registration Succesfull";
    const text = "thankyou for registering. Your Registration was succesfull.";
    await sendSuccessEmail(email,subject,text);

    res.status(201).json({message: " registration Successful",token: token,isPremium});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const processlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ Error: "User not Exist" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    const token = jwt.sign({userId:user.id},process.env.jwtSecret);
    const isPremium = user.isPremiumuser;
    console.log("Password Matched : ", passwordMatched);

    if (passwordMatched) {
      console.log("password match");
      //Passwords match, so the user is authenticated
      const subject = "Login Successful";
      const text = "Thank you for logging in. Your login was successful.";
      await sendSuccessEmail(email,subject,text);
      res.status(200).json({ message: "login successfully", token , isPremium});
    } else {
      console.log("password not match");
      // Passwords don't match
      res.status(401).json({ error: "Invalid credentials" });
    };
  } catch (err) {
    console.log("Error during Login", err);
    res.status(500).json({ error: "Error occured while login" });
  }
};

async function sendSuccessEmail(to , subject , text){
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
      user:process.env.Email,
      pass:process.env.Email_pass,
    }
  })
  const mailOptions = {
    from: process.env.Email,
    to,
    subject,
    text,
  }
  try{
    await transporter.sendMail(mailOptions);
    console.log("Success email sent");
  }catch(error){
    console.log("Error sending success email:",error)
  }
}

module.exports = { processSignup, processlogin };